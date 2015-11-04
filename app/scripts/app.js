
// Submission ID, S7755084
// Common Name, Black-bellied Whistling-Duck
// Scientific Name, Dendrocygna autumnalis
// Taxonomic Order, 215
// Count, X
// State/Province, US-TX
// County, Cameron
// Location, Brownsville
// Latitude, 25.911388
// Longitude, -97.4904876
// Date, 04-17-2004
// Time,
// Protocol, eBird - Casual Observation
// Duration (Min),
// All Obs Reported,
// Distance Traveled (km),
// Area Covered (ha),
// Number of Observers,
// Breeding Code,
// Species Comments,
// Checklist Comments


gSightings = [];
gSightingsByYear = {};
gScientificNames = [];
gCommonNames = [];
gLocations = [];
gDates = [];
gStates = [];

function getEarliestSighting(sightingList) {
	sightingList.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });
	return sightingList[0];
}

function getLatestSighting(sightingList) {
	sightingList.sort(function(a, b) { return b['DateObject'] - a['DateObject']; });
	return sightingList[0];
}

function getUniqueValues(sightingList, fieldName) {
	var values = [];

	for (var index = 1; index < sightingList.length; index++) {
		var aValue = sightingList[index][fieldName];
		if (values.indexOf(aValue) < 0) {
			values.push(aValue);
		}
	}

	return values;
};

function addDateObjects() {
	for (var index = 0; index < gSightings.length; index++) {
		var sighting = gSightings[index];

		if (sighting['Date']) {
			var pieces = sighting['Date'].split('-');
			var fixedDateString = [pieces[0], '/', pieces[1], '/', pieces[2]].join('');
			gSightings[index]['DateObject'] = new Date(fixedDateString);

			if (! gSightingsByYear[pieces[2]]) {
				gSightingsByYear[pieces[2]] = [];
			}
			gSightingsByYear[pieces[2]].push(sighting);
		}
	}

	gSightings.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });
}

function getSightingsForDate(inDate) {
	return gSightings.filter(function(s) { return s['Date'] == inDate; });
};

function getSightingsForScientificName(inScientificName) {
	return gSightings.filter(function(s) { return s['Scientific Name'] == inScientificName; });
};

function getSightingsForCommonName(inCommonName) {
	return gSightings.filter(function(s) { return s['Common Name'] == inCommonName; });
};

function getSightingsForLocation(inLocation) {
	return gSightings.filter(function(s) { return s['Location'] == inLocation; });
};

function renderTemplate(inPrefix, inData) {
    var theTemplateScript = document.getElementById(inPrefix + '-template').innerHTML;
    var theTemplate = Handlebars.compile(theTemplateScript);
	var newDiv = document.createElement("div");
	newDiv.innerHTML = theTemplate(inData);

	var results = document.getElementById(inPrefix + '-results');
	while (results.firstChild) {
	    results.removeChild(results.firstChild);
	}

    results.appendChild(newDiv);
}

var eBirdData = null;

function getAllFirstSightings() {
	var firstSightings = gScientificNames.map(function (n) {
		return getEarliestSighting(getSightingsForScientificName(n));
	});

	firstSightings.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });

	return firstSightings;
}

function showSection(inSelector) {
	for (var item of document.querySelectorAll(inSelector)) {
		item.classList.remove('hidden');
		item.classList.add('visible');
	}
}

var routingMap = {
	'#home' : function() {
		renderTemplate('home', {
			numSightings: gSightings.length,
			sightingsByYear: gSightingsByYear,
			numChecklists: getUniqueValues(gSightings, 'Submission ID').length,
			earliest: getEarliestSighting(gSightings),
			latest: getLatestSighting(gSightings),
			owner: 'Bill Walker'
		});

		showSection('section#home');
	}, 
	'#chrono' : function() {
		var firstSightings = getAllFirstSightings();

		renderTemplate('chrono', {
			firstSightings: firstSightings
		});

		showSection('section#chrono');
	}, 
	'#trips' : function() {
		renderTemplate('trips', {
			trips: gDates
		});

		showSection('section#trips');
	}, 
	'#trip' : function(inDate) {
		var tripSightings = getSightingsForDate(inDate);

		renderTemplate('trip', {
			name: inDate,
			comments: getUniqueValues(tripSightings, 'Checklist Comments'),
			submissions: getUniqueValues(tripSightings, 'Submission ID'),
			sightings: tripSightings
		});

		showSection('section#trip');
	}, 
	'#locations' : function() {
		renderTemplate('locations', {
			locations: gLocations
		});

		showSection('section#locations');
	}, 
	'#location' : function(inLocationName) {
		var locationSightings = getSightingsForLocation(inLocationName);

		renderTemplate('location', {
			name: inLocationName,
			county: locationSightings[0]["County"],
			state: locationSightings[0]["State/Province"],
			sightings: locationSightings,
			dates: getUniqueValues(locationSightings, "Date"),
			taxons: getUniqueValues(locationSightings, "Common Name")
		});

		showSection('section#location');
	}, 
	'#taxons' : function() {
		renderTemplate('taxons', {
			taxons: gCommonNames
		});

		showSection('section#taxons');
	}, 
	'#taxon' : function(inCommonName) {
		var taxonSightings = getSightingsForCommonName(inCommonName);

		renderTemplate('taxon', {
			name: inCommonName,
			scientificName: taxonSightings[0]["Scientific Name"],
			sightings: taxonSightings
		});

		showSection('section#taxon');
	}, 
}

function routeBasedOnHash() {
	// On every hash change the render function is called with the new hash.
	// This is how the navigation of our app happens.
	var theHashParts = window.location.hash.split('/');
	console.log('changed', theHashParts[0], theHashParts[1]);

	for (var item of document.querySelectorAll('section.card')) {
		item.classList.remove('visible');
		item.classList.add('hidden');
	}

	if(routingMap[theHashParts[0]]) {
		routingMap[theHashParts[0]](decodeURI(theHashParts[1]));
	} else {
		console.log('not found', window.location.hash);
	}	
}

window.onhashchange = routeBasedOnHash;

document.addEventListener("DOMContentLoaded", function(event) { 
	console.log('starting');

	Handlebars.registerHelper('nicedate', function(inDate) {
	  return new Handlebars.SafeString(
	    inDate.toLocaleDateString()
	  );
	});

	Handlebars.registerHelper('nicenumber', function(inNumber) {
	  return new Handlebars.SafeString(
	    inNumber.toLocaleString()
	  );
	});

	Papa.parse("./data/ebird.csv", {
		download: true,
		header: true,
		complete: function(results) {
			gSightings = results.data;

			addDateObjects();

			gScientificNames = getUniqueValues(gSightings, 'Scientific Name');
			gCommonNames = getUniqueValues(gSightings, 'Common Name');
			gLocations = getUniqueValues(gSightings, 'Location');
			gDates = getUniqueValues(gSightings, 'Date');
			gStates = getUniqueValues(gSightings, 'State/Province');

			routeBasedOnHash();
		}	
	});
});



