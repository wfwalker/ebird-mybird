"use strict";

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


var gSightings = [];
var gScientificNames = [];
var gCommonNames = [];
var gLifeSightingsTaxonomic = [];
var gLifeSightingsChronological = [];
var gSightingsByYear = {};
var gEarliestSightingByCommonName = {};
var gLocations = [];
var gDates = [];
var gStates = [];
var gCustomDayNames = [];

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

			if (! gEarliestSightingByCommonName[sighting['Common Name']]) {
				gEarliestSightingByCommonName[sighting['Common Name']] = sighting;
			} else if (sighting.DateObject < gEarliestSightingByCommonName[sighting['Common Name']].DateObject) {
				gEarliestSightingByCommonName[sighting['Common Name']] = sighting;
			}
		}
	}

	gLifeSightingsTaxonomic = Object.keys(gEarliestSightingByCommonName).map(function(k){return gEarliestSightingByCommonName[k]});
	gLifeSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	gLifeSightingsChronological = Object.keys(gEarliestSightingByCommonName).map(function(k){return gEarliestSightingByCommonName[k]});
	gLifeSightingsChronological.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });

	gSightings.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });
}

function getSightingsForDate(inDate) {
	return gSightings.filter(function(s) { return s['Date'] == inDate; });
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

function showSection(inSelector) {
	for (var item of document.querySelectorAll(inSelector)) {
		item.classList.remove('hidden');
		item.classList.add('visible');
	}
}

function barGraphCountsForSightings(inData, inElement) {
	var labels = Object.keys(inData).map(function(k){return k;});
	var values = Object.keys(inData).map(function(k){return inData[k].length;});
	var values2 = Object.keys(inData).map(function(k){return getUniqueValues(inData[k], 'Common Name').length;});
	var values3 = Object.keys(inData).map(function(k){return getUniqueValues(inData[k], 'Location').length;});

	labels.unshift('x');
	values.unshift('sightings');
	values2.unshift('species');
	values3.unshift('locations');

	var chart = c3.generate({
		bindto: '#' + inElement,
		data: {
			x: 'x',
			columns: [
				values,
				values2,
				values3,
				labels,
			],
			types: {
				sightings: 'line',
				species: 'line',
				locations: 'line'
			}
		}
	});
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

		barGraphCountsForSightings(gSightingsByYear, 'byYearChartContainer');

		showSection('section#home');
	}, 
	'#chrono' : function() {
		renderTemplate('chrono', {
			firstSightings: gLifeSightingsChronological
		});

		showSection('section#chrono');
	}, 
	'#trips' : function() {
		renderTemplate('trips', {
			trips: gDates,
			customDayNames: gCustomDayNames
		});

		showSection('section#trips');
	}, 
	'#trip' : function(inDate) {
		var tripSightings = getSightingsForDate(inDate);

		renderTemplate('trip', {
			name: inDate,
			customName: gCustomDayNames[inDate],
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
		var locationSightingsChronological = getSightingsForLocation(inLocationName);
		locationSightingsChronological.sort(function(a, b) { return b['DateObject'] - a['DateObject']; });

		var locationSightingsTaxonomic = locationSightingsChronological.slice(0);
		locationSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

		renderTemplate('location', {
			name: inLocationName,
			county: locationSightingsChronological[0]["County"],
			state: locationSightingsChronological[0]["State/Province"],
			locationSightingsTaxonomic: locationSightingsTaxonomic,
			longitude: locationSightingsChronological[0]["Longitude"],
			latitude: locationSightingsChronological[0]["Latitude"],
			dates: getUniqueValues(locationSightingsChronological, "Date"),
			taxons: getUniqueValues(locationSightingsTaxonomic, "Common Name")
		});

		showSection('section#location');
	}, 
	'#taxons' : function() {
		renderTemplate('taxons', {
			lifeSightings: gLifeSightingsTaxonomic
		});

		showSection('section#taxons');
	}, 
	'#taxon' : function(inCommonName) {
		var taxonSightings = getSightingsForCommonName(inCommonName);
		taxonSightings.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });

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

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", function() {
  gCustomDayNames = JSON.parse(this.responseText);
  console.log('loaded custom day names', gCustomDayNames.length);
});
oReq.open("GET", "./data/day-names.json");
oReq.send();

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



