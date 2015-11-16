"use strict";

var gSightings = null;
var gOmittedCommonNames = [];
var gCustomDayNames = [];
var gPhotos = [];

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
	var values3 = Object.keys(inData).map(function(k){return new SightingList(inData[k]).locations.length;});

	labels.unshift('x');
	values.unshift('sightings');
	values2.unshift('species');
	values3.unshift('locations');

	var chart = c3.generate({
		bindto: d3.select(inElement),
		axis: {
			y: {
				show: false
			}
		},
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
			},
			onclick: function(d, element) {
				window.location.hash = '#year/' + d.x;
			}
		}
	});
}

function byMonthForSightings(inData, inElement) {
	var labels = ['x', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var values = inData.map(function(a){return a.length;});

	values.unshift('sightings');

	var chart = c3.generate({
		bindto: d3.select(inElement),
		size: {
			width: 400,
			height: 150
		},
		bar: {
			width: {
				ratio: 1.0
			}
		},
		axis: {
			x: {
				type: 'category'
			},
			y: {
				show: false
			}
		},
		legend: {
			show: false
		},
		data: {
			x: 'x',
			columns: [
				values,
				labels
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
			sightingsByMonth: gSightings.byMonth(),
			yearChartID: 'byYear' + Date.now(),
			monthChartID: 'byMonth' + Date.now(),
			numChecklists: gSightings.checklists.length,
			earliest: gSightings.earliestDateObject,
			latest: gSightings.latestDateObject,
			owner: 'Bill Walker'
		});

		showSection('section#home');
	}, 
	'#chrono' : function() {
		var earliestByCommonName = gSightings.earliestByCommonName();
		var lifeSightingsChronological = Object.keys(earliestByCommonName).map(function(k){return earliestByCommonName[k]});
		lifeSightingsChronological.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });

		renderTemplate('chrono', {
			firstSightings: lifeSightingsChronological
		});

		showSection('section#chrono');
	}, 
	'#trips' : function() {
		renderTemplate('trips', {
			trips: gSightings.dateObjects,
			customDayNames: gCustomDayNames
		});

		showSection('section#trips');
	}, 
	'#trip' : function(inDate) {
		var tripSightings = gSightings.filter(function(s) { return s['Date'] == inDate; });
		var tripSightingList = new SightingList(tripSightings);

		renderTemplate('trip', {
			tripDate: tripSightings[0].DateObject,
			photos: gPhotos.filter(function(p){return p.tripDate == inDate;}),
			customName: gCustomDayNames[inDate],
			comments: tripSightingList.getUniqueValues('Checklist Comments'),
			sightingList: tripSightingList
		});

		showSection('section#trip');
	}, 
	'#year' : function(inYear) {
		var yearSightings = gSightings.byYear()[inYear];
		yearSightings.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
		var yearSightingList = new SightingList(yearSightings);

		renderTemplate('year', {
			year: inYear,
			photos: gPhotos.filter(function(p){return p.date.substring(0,4) == inYear;}),
			yearSightings: yearSightings,
			yearSpecies: yearSightingList.getUniqueValues('Common Name')
		});

		showSection('section#year');
	},
	'#locations' : function() {
		renderTemplate('locations', {
			locations: gSightings.locations
		});

		showSection('section#locations');
	}, 
	'#location' : function(inLocationName) {
		var locationSightingsTaxonomic = gSightings.filter(function(s) { return s['Location'] == inLocationName; });
		locationSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

		var locationSightingList = new SightingList(locationSightingsTaxonomic);

		renderTemplate('location', {
			name: inLocationName,
			chartID: 'bymonth' + Date.now(),
			sightingsByMonth: locationSightingList.byMonth(),
			photos: gPhotos.filter(function(p) { return p.location == inLocationName }),
			county: locationSightingsTaxonomic[0]["County"],
			state: locationSightingsTaxonomic[0]["State/Province"],
			locationSightingsTaxonomic: locationSightingsTaxonomic,
			longitude: locationSightingsTaxonomic[0]["Longitude"],
			latitude: locationSightingsTaxonomic[0]["Latitude"],
			dateObjects: locationSightingList.dateObjects,
			taxons: locationSightingList.getUniqueValues("Common Name")
		});

		showSection('section#location');
	}, 
	'#taxons' : function() {
		var earliestByCommonName = gSightings.earliestByCommonName();
		var lifeSightingsTaxonomic = Object.keys(earliestByCommonName).map(function(k){return earliestByCommonName[k]});
		lifeSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

		renderTemplate('taxons', {
			lifeSightings: lifeSightingsTaxonomic
		});

		showSection('section#taxons');
	}, 
	'#taxon' : function(inCommonName) {
		var taxonSightings = gSightings.filter(function(s) { return s['Common Name'] == inCommonName; });
		taxonSightings.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });

		var taxonSightingsList = new SightingList(taxonSightings);

		var scientificName = taxonSightings[0]["Scientific Name"];

		renderTemplate('taxon', {
			name: inCommonName,
			photos: gPhotos.filter(function(p){return p.scientificName == scientificName;}),
			scientificName: scientificName,
			sightingsByMonth: taxonSightingsList.byMonth(),
			sightings: taxonSightings,
			chartID: 'bymonth' + Date.now()
		});

		showSection('section#taxon');
	}, 
	'#debug' : function() {
		console.log('moo');
		var tmp = gSightings.filter(function(s) { return s["Location"] && s["Location"].indexOf('/') >= 0; })
		var brokenLocationSightingList = new SightingList(tmp);

		renderTemplate('debug', {
			photosMissingTrip: gPhotos.filter(function(p) { return gSightings.dates.indexOf(p.tripDate) < 0; }),
			photosMissingLocation: gPhotos.filter(function(p) { return gSightings.locations.indexOf(p.location) < 0; }),
			photos: gPhotos,
			brokenLocations: brokenLocationSightingList.getUniqueValues("Location")
		});

		showSection('section#debug');
	}
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

function loadPhotos() {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		gPhotos = JSON.parse(this.responseText);
		console.log('loaded photos', gPhotos.length);


		for (var index = 0; index < gPhotos.length; index++) {
			var imageFilename = '';
			var photo = gPhotos[index];
			if (photo.abbreviation == 'NULL') {
				imageFilename = photo.date + '-' + photo.scientificName.replace(' ', '_').toLowerCase();
			} else {
				imageFilename = photo.date + '-' + photo.abbreviation;
			}

			if (photo.original_filename != 'NULL') {
				imageFilename = imageFilename + '-' + photo.original_filename;
			}

			gPhotos[index].photoURL = 'http://birdwalker.com/images/photo/' + imageFilename + '.jpg';
			gPhotos[index].thumbURL = 'http://birdwalker.com/images/thumb/' + imageFilename + '.jpg';
			var tmp = photo.date.split('-');
			gPhotos[index].tripDate = [tmp[1], tmp[2], tmp[0]].join('-');
		}
	});
	oReq.open("GET", "./data/photos.json");
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

		Handlebars.registerHelper('ebirddate', function(inDate) {
			return new Handlebars.SafeString (
				d3.time.format("%m-%d-%Y")(inDate)
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
			routeBasedOnHash();
		}
	});

	window.onhashchange = routeBasedOnHash;

	loadCustomDayNames();
	loadOmittedCommonNames();
	loadPhotos();
}


