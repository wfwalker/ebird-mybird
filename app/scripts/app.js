
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


gSightings = null;

function getEarliestSighting(sightingList) {
	sightingList.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });
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
		}
	}
}

function getSightingsForDate(inDate) {
	return gSightings.filter(function(s) { return s['Date'] == inDate; });
};

function getSightingsForScientificName(inScientificName) {
	return gSightings.filter(function(s) { return s['Scientific Name'] == inScientificName; });
};

function getSightingsForLocation(inLocation) {
	return gSightings.filter(function(s) { return s['Location'] == inLocation; });
};

function renderTemplate(inPrefix) {
    var theTemplateScript = document.getElementById(inPrefix + '-template').innerHTML;
    var theTemplate = Handlebars.compile(theTemplateScript);
	var p = document.createElement("p");
	p.innerHTML = theTemplate({locations: gLocations, trips: gDates});

	var results = document.getElementById(inPrefix + '-results');
	while (results.firstChild) {
	    results.removeChild(results.firstChild);
	}

    results.appendChild(p);
}

var eBirdData = null;

function getAllFirstSightings() {
	var firstSightings = gScientificNames.map(function (n) {
		return getEarliestSighting(getSightingsForScientificName(n));
	});

	firstSightings.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });

	return firstSightings;
}

document.addEventListener("DOMContentLoaded", function(event) { 
	console.log('starting');

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

			// console.log('a day in trinidad', getSightingsForDate('01-18-2014'));

			// console.log('snowy egret', getSightingsForScientificName('Egretta thula'));

			// console.log('black phoebe first', getEarliestSighting(getSightingsForScientificName('Sayornis nigricans'))['Date']);

			// console.log('charleston slough species', getUniqueValues(getSightingsForLocation('Charleston Slough'), 'Scientific Name'));

			// var firstSightings = getAllFirstSightings();

			// for (var index = 0; index < firstSightings.length; index++) {
			// 	addSummaryItem(firstSightings[index]['Date'] + ' ' + firstSightings[index]['Location'] + ' ' + firstSightings[index]['Common Name']);
			// }

			for (var item of document.querySelectorAll('a[data-hash]')) {
				item.addEventListener('click', function (e) {
			    	e.preventDefault();
			    	window.location.hash = e.target.getAttribute('data-hash');
			    });
			}
		}	
	});
});

var routingMap = {
	'#trips' : function() {
		for (var item of document.querySelectorAll('section#trips')) {
			item.classList.remove('hidden');
			item.classList.add('visible');
		}

		renderTemplate('trips');
	}, 
	'#locations' : function() {
		for (var item of document.querySelectorAll('section#locations')) {
			item.classList.remove('hidden');
			item.classList.add('visible');
		}

		renderTemplate('locations');
	}, 
}

window.onhashchange = function() {
	// On every hash change the render function is called with the new hash.
	// This is how the navigation of our app happens.
	console.log('changed', window.location.hash);

	for (var item of document.querySelectorAll('section.card')) {
		item.classList.remove('visible');
		item.classList.add('hidden');
	}

	if(routingMap[window.location.hash]) {
		routingMap[window.location.hash]();
	} else {
		console.log('not found', window.location.hash);
	}
};




