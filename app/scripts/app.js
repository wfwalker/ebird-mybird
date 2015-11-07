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
var gChecklists = [];
var gEarliestSightingDateObject = null;
var gLatestSightingDateObject = null;
var gOmittedCommonNames = [];
var gLifeSightingsTaxonomic = [];
var gLifeSightingsChronological = [];
var gSightingsByYear = {};
var gEarliestSightingByCommonName = {};
var gLocations = [];
var gDates = [];
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
			var newDate = new Date(fixedDateString);
			gSightings[index]['DateObject'] = newDate;

			if (gEarliestSightingDateObject == null || newDate < gEarliestSightingDateObject) {
				gEarliestSightingDateObject = newDate;
			}

			if (gLatestSightingDateObject == null || newDate > gLatestSightingDateObject) {
				gLatestSightingDateObject = newDate;
			}

			if (! gSightingsByYear[pieces[2]]) {
				gSightingsByYear[pieces[2]] = [];
			}
			gSightingsByYear[pieces[2]].push(sighting);

			var omit = gOmittedCommonNames.indexOf(sighting['Common Name']) >=0;

			if (! omit) {
				if (! gEarliestSightingByCommonName[sighting['Common Name']]) {
					gEarliestSightingByCommonName[sighting['Common Name']] = sighting;
				} else if (sighting.DateObject < gEarliestSightingByCommonName[sighting['Common Name']].DateObject) {
					gEarliestSightingByCommonName[sighting['Common Name']] = sighting;
				}				
			}
		}
	}

	gSightings.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });
}

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
		bindto: d3.select(inElement),
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
			chartID: 'byYear',
			numChecklists: getUniqueValues(gSightings, 'Submission ID').length,
			earliest: gEarliestSightingDateObject,
			latest: gLatestSightingDateObject,
			owner: 'Bill Walker'
		});

		showSection('section#home');
	}, 
	'#chrono' : function() {
		gLifeSightingsChronological = Object.keys(gEarliestSightingByCommonName).map(function(k){return gEarliestSightingByCommonName[k]});
		gLifeSightingsChronological.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });

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
		var tripSightings = gSightings.filter(function(s) { return s['Date'] == inDate; });

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
		var locationSightingsChronological = gSightings.filter(function(s) { return s['Location'] == inLocationName; });
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
		gLifeSightingsTaxonomic = Object.keys(gEarliestSightingByCommonName).map(function(k){return gEarliestSightingByCommonName[k]});
		gLifeSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

		renderTemplate('taxons', {

			lifeSightings: gLifeSightingsTaxonomic
		});

		showSection('section#taxons');
	}, 
	'#taxon' : function(inCommonName) {
		var taxonSightings = gSightings.filter(function(s) { return s['Common Name'] == inCommonName; });
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

function loadCustomDayNames() {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
	  gCustomDayNames = JSON.parse(this.responseText);
	  console.log('loaded custom day names', Object.keys(gCustomDayNames).length);
	});
	oReq.open("GET", "./data/day-names.json");
	oReq.send();
}

function loadOmittedCommonNames() {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
	  gOmittedCommonNames = JSON.parse(this.responseText);
	  console.log('loaded omitted common names', gOmittedCommonNames.length);
	});
	oReq.open("GET", "./data/omitted-common-names.json");
	oReq.send();
}

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

	Handlebars.registerHelper('bargraph', function(inData, inElement) {
		// per @digitarald use timeout to reorder helper after Handlebars templating
		window.setTimeout(function () { barGraphCountsForSightings(inData, '#' + inElement) }, 1);
	});

	Papa.parse("./data/ebird.csv", {
		download: true,
		header: true,
		complete: function(results) {
			gSightings = results.data;

			addDateObjects();

			gLocations = getUniqueValues(gSightings, 'Location');
			gDates = getUniqueValues(gSightings, 'Date');
			gChecklists = getUniqueValues(gSightings, 'Submission ID');

			routeBasedOnHash();
		}	
	});
});

window.onhashchange = routeBasedOnHash;

loadCustomDayNames();
loadOmittedCommonNames();


