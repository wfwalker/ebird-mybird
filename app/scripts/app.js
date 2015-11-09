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


var gSightings = null;
var gChecklists = [];
var gOmittedCommonNames = [];
var gLifeSightingsTaxonomic = [];
var gLifeSightingsChronological = [];
var gLocations = [];
var gDates = [];
var gCustomDayNames = [];

function renderTemplate(inPrefix, inData) {

    var theTemplateScript = document.getElementById(inPrefix + '-template').innerHTML;
    var theTemplate = Handlebars.compile(theTemplateScript);
	var newDiv = document.createElement("div");
	newDiv.innerHTML = theTemplate(inData);

	var results = document.getElementById(inPrefix + '-results');
	while (results.firstChild) {
	    results.removeChild(results.firstChild);
	}

    // hide loading section
	document.getElementById('loading').classList.remove('visible');
	document.getElementById('loading').classList.add('hidden');

	// show rendered template
    results.appendChild(newDiv);
}

function showSection(inSelector) {
	var sections = document.querySelectorAll(inSelector);
	for (var index = 0; index < sections.length; index++) {
		sections[index].classList.remove('hidden');
		sections[index].classList.add('visible');
	}
}

function hideAllSections() {
	var sections = document.querySelectorAll('section.card');
	for (var index = 0; index < sections.length; index++) {
		sections[index].classList.remove('visible');
		sections[index].classList.add('hidden');
	}
}

function barGraphCountsForSightings(inData, inElement) {
	var labels = Object.keys(inData).map(function(k){return k;});
	var values = Object.keys(inData).map(function(k){return inData[k].length;});
	var values2 = Object.keys(inData).map(function(k){return new SightingList(inData[k]).getUniqueValues('Common Name').length;});
	var values3 = Object.keys(inData).map(function(k){return new SightingList(inData[k]).getUniqueValues('Location').length;});

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

function byMonthForSightings(inData, inElement) {
	// var labels = ['x', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var values = inData.map(function(a){return a.length;});

	values.unshift('sightings');

	var chart = c3.generate({
		bindto: d3.select(inElement),
		size: {
			width: 640,
			height: 200
		},
		bar: {
			width: {
				ratio: 1.0
			}
		},
		data: {
			columns: [
				values
			],
			types: {
				sightings: 'bar'
			}
		}
	});
}

var routingMap = {
	'#home' : function() {
		renderTemplate('home', {
			numSightings: gSightings.count(),
			sightingsByYear: gSightings.byYear(),
			chartID: 'byYear',
			numChecklists: gChecklists.length,
			earliest: gSightings.earliestDateObject,
			latest: gSightings.latestDateObject,
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
		var tripSightingList = new SightingList(tripSightings);

		renderTemplate('trip', {
			tripDate: tripSightings[0].DateObject,
			customName: gCustomDayNames[inDate],
			comments: tripSightingList.getUniqueValues('Checklist Comments'),
			submissions: tripSightingList.getUniqueValues('Submission ID'),
			sightings: tripSightings
		});

		showSection('section#trip');
	}, 
	'#year' : function(inYear) {
		var yearSightings = gSightings.byYear()[inYear];

		renderTemplate('year', {
			year: inYear,
			yearSightings: yearSightings,
			yearSpecies: getUniqueValues(yearSightings, 'Common Name')
		});

		showSection('section#year');
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

		var sightingsByMonth = [null, [],[],[],[],[],[],[],[],[],[],[],[]];

		for (var index = 0; index < taxonSightings.length; index++) {
			var tmp = parseInt(taxonSightings[index].Date.substring(0,2));
			sightingsByMonth[tmp].push(taxonSightings[index]);
		}

		sightingsByMonth.shift();

		console.log(sightingsByMonth);

		renderTemplate('taxon', {
			name: inCommonName,
			scientificName: taxonSightings[0]["Scientific Name"],
			sightingsByMonth: sightingsByMonth,
			sightings: taxonSightings,
			chartID: 'bymonth'
		});

		showSection('section#taxon');
	}, 
}

function routeBasedOnHash() {
	hideAllSections();

	// show loading section
	document.getElementById('loading').classList.add('visible');
	document.getElementById('loading').classList.remove('hidden');

	// On every hash change the render function is called with the new hash.
	// This is how the navigation of our app happens.
	var theHashParts = window.location.hash.split('/');
	console.log('changed', theHashParts[0], theHashParts[1]);

	if (! theHashParts[0]) {
		// TODO: should use push state
		theHashParts[0] = '#home';
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

// REDIRECT to HTTPS!
var host = "wfwalker.github.io";
if ((host == window.location.host) && (window.location.protocol != "https:")) {
	window.location.protocol = "https";
} else {
	document.addEventListener("DOMContentLoaded", function(event) { 
		console.log('start DOMContentLoaded');

		Handlebars.registerHelper('nicedate', function(inDate) {
			return new Handlebars.SafeString (
				d3.time.format("%b %d, %Y")(inDate)
			);
		});

		Handlebars.registerHelper('nicenumber', function(inNumber) {
			return new Handlebars.SafeString (
				d3.format(",d")(inNumber)
			);
		});

		Handlebars.registerHelper('bargraph', function(inData, inElement) {
			// per @digitarald use timeout to reorder helper after Handlebars templating
			window.setTimeout(function () { barGraphCountsForSightings(inData, '#' + inElement) }, 1);
		});

		Handlebars.registerHelper('monthgraph', function(inData, inElement) {
			// per @digitarald use timeout to reorder helper after Handlebars templating
			window.setTimeout(function () { byMonthForSightings(inData, '#' + inElement) }, 1);
		});

		console.log('end DOMContentLoaded');
	});

	Papa.parse("./data/ebird.csv", {
		download: true,
		header: true,
		complete: function(results) {
			gSightings = new SightingList(results.data);

			gLocations = gSightings.getUniqueValues('Location');
			gDates = gSightings.getUniqueValues('Date');
			gChecklists = gSightings.getUniqueValues('Submission ID');

			routeBasedOnHash();
		}
	});

	window.onhashchange = routeBasedOnHash;

	loadCustomDayNames();
	loadOmittedCommonNames();
}


