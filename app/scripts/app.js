'use strict';

// GETWEEK script:
// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: http://weeknumber.net/how-to/javascript 

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
   date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

var gSightings = null;
var gOmittedCommonNames = [];
var gCustomDayNames = [];
var gPhotos = [];
var gCompiledTemplates = {};
var gIndex = null;

function renderTemplate(inPrefix, inPageTitle, inData) {
	var compiledTemplate = ebirdmybird[inPrefix];
	var newDiv = document.createElement('div');
	newDiv.innerHTML = compiledTemplate(inData);

	var results = document.getElementById(inPrefix + '-results');

	if (! results) {
		throw new Error('internal error, missing div for ' + inPrefix);
	}

	while (results.firstChild) {
	    results.removeChild(results.firstChild);
	}

	hideAllSections();

	// show rendered template
    results.appendChild(newDiv);
	showSection('section#' + inPrefix);
	document.title = 'ebird-mybird | ' + inPageTitle;
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

	var tempSightingLists = Object.keys(inData).map(function(k) { return new SightingList(inData[k]); });

	var values2 = tempSightingLists.map(function(l) { return l.getUniqueValues('Common Name').length; });
	var values3 = tempSightingLists.map(function(l) { return l.getUniqueValues('Location').length; });

	labels.unshift('x');
	values.unshift('sightings');
	values2.unshift('species');
	values3.unshift('locations');

	var chart = c3.generate({
		bindto: d3.select(inElement),
		size: {
			height: 150,
		},
		axis: {
			y: {
				show: false,
			},
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
				locations: 'line',
			},
			onclick: function(d, element) {
				window.location.hash = '#year/' + d.x;
			},
		},
		tooltip: {
			format: {
				value: d3.format(','), // apply to all
			},
		},
	});
}

function byMonthForSightings(inData, inElement) {
	var labels = ['x', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var values = inData.map(function(a){return a.length;});

	values.unshift('sightings');

	var chart = c3.generate({
		bindto: d3.select(inElement),
		size: {
			height: 150,
		},
		bar: {
			width: {
				ratio: 1.0,
			},
		},
		axis: {
			x: {
				type: 'category',
			},
			y: {
				show: false,
			},
		},
		legend: {
			show: false,
		},
		data: {
			x: 'x',
			columns: [
				values,
				labels,
			],
			types: {
				sightings: 'bar',
			},
		},
		tooltip: {
			format: {
				value: d3.format(','), // apply to all
			},
		},
    });
}

function renderHome() {
	var currentWeekOfYear = new Date().getWeek();
	var photosThisWeek = gPhotos.filter(function(p) { return p.DateObject.getWeek() == currentWeekOfYear; });

	console.log(photosThisWeek);

	renderTemplate('home', 'Home', {
		photoOfTheWeek: photosThisWeek.pop(),
		owner: 'Bill Walker',
	});
}

function renderStats() {
	renderTemplate('stats', 'Statistics', {
		numSightings: gSightings.count(),
		sightingsByYear: gSightings.byYear(),
		sightingsByMonth: gSightings.byMonth(),
		yearChartID: 'byYear' + Date.now(),
		monthChartID: 'byMonth' + Date.now(),
		numChecklists: gSightings.getUniqueValues('Submission ID').length,
		earliest: gSightings.earliestDateObject,
		latest: gSightings.latestDateObject,
		owner: 'Bill Walker',
	});
}

function renderLoading() {
	renderTemplate('loading', 'Loading', {
		owner: 'Bill Walker',
	});
}

function renderChrono() {
	var earliestByCommonName = gSightings.getEarliestByCommonName();
	var lifeSightingsChronological = Object.keys(earliestByCommonName).map(function(k) { return earliestByCommonName[k]; });
	lifeSightingsChronological.sort(function(a, b) { return b['DateObject'] - a['DateObject']; });

	renderTemplate('chrono', 'Life List', {
		firstSightings: lifeSightingsChronological,
	});
}

function renderTrips() {
	renderTemplate('trips', 'Trips', {
		trips: gSightings.dateObjects,
		customDayNames: gCustomDayNames,
	});
}

function renderBigDays() {
	var speciesByDate = gSightings.getSpeciesByDate();
	var bigDays = Object.keys(speciesByDate).map(function (key) { return [key, speciesByDate[key]]; });
	var bigDays = bigDays.filter(function (x) { return x[1].length > 100; });
	bigDays = bigDays.map(function (x) { return { date: x[0], count: x[1].length }; });
	bigDays.sort(function (x,y) { return y.count - x.count; } );

	renderTemplate('bigdays', 'Big Days', {
		bigDays: bigDays,
		customDayNames: gCustomDayNames,
	});
}

function renderTrip(inDate) {
	var tripSightings = gSightings.filter(function(s) { return s['Date'] == inDate; });
	var tripSightingList = new SightingList(tripSightings);

	renderTemplate('trip', inDate, {
		tripDate: tripSightings[0].DateObject,
		photos: gPhotos.filter(function(p){return p.Date == inDate;}),
		customName: gCustomDayNames[inDate],
		comments: tripSightingList.getUniqueValues('Checklist Comments'),
		sightingList: tripSightingList,
	});
}

function renderYear(inYear) {
	var yearSightings = gSightings.byYear()[inYear];
	yearSightings.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var yearSightingList = new SightingList(yearSightings);

	renderTemplate('year', inYear, {
		year: inYear,
		photos: gPhotos.filter(function(p){return p.Date.substring(6,10) == inYear;}),
		yearSightings: yearSightings,
		yearSpecies: yearSightingList.getUniqueValues('Common Name'),
	});
}

function renderSighting(inID) {
	renderTemplate('sighting', gSightings.rows[inID]['Common Name'],
		gSightings.rows[inID]
	);
}

function renderPhoto(inID) {
	renderTemplate('photo', gPhotos[inID]['Common Name'],
		gPhotos[inID]
	);
}

function renderPhotos() {
	var photoCommonNames = [];

	for (var index = 0; index < gPhotos.length; index++) {
		var aValue = gPhotos[index]['Common Name'];
		if (photoCommonNames.indexOf(aValue) < 0) {
			photoCommonNames.push(aValue);
		}
	}

	photoCommonNames.sort();

	console.log(photoCommonNames);

	renderTemplate('photos', 'Photos', {
		photos: gPhotos,
		photoCommonNames: photoCommonNames,
	});
}

function renderLocations() {
	renderTemplate('locations', 'Locations', {
		count: gSightings.getUniqueValues('Location').length,
		hierarchy: gSightings.getLocationHierarchy(),
	});
}

function renderLocation(inLocationName) {
	var locationSightingsTaxonomic = gSightings.filter(function(s) { return s['Location'] == inLocationName; });
	locationSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	var locationSightingList = new SightingList(locationSightingsTaxonomic);

	renderTemplate('location', inLocationName, {
		name: inLocationName,
		chartID: 'bymonth' + Date.now(),
		showChart: locationSightingsTaxonomic.length > 100,
		sightingsByMonth: locationSightingList.byMonth(),
		photos: gPhotos.filter(function(p) { return p.Location == inLocationName; }),
		locationSightingsTaxonomic: locationSightingsTaxonomic,
		sightingList: locationSightingList,
		customDayNames: gCustomDayNames,
	});
}

function renderCounty(inCountyName) {
	var countySightingsTaxonomic = gSightings.filter(function(s) { return s['County'] == inCountyName; });
	countySightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	var countySightingList = new SightingList(countySightingsTaxonomic);
	var countyLocations = countySightingList.getUniqueValues('Location');


	renderTemplate('county', inCountyName + ' County', {
		name: inCountyName,
		chartID: 'bymonth' + Date.now(),
		sightingsByMonth: countySightingList.byMonth(),
		photos: gPhotos.filter(function(p) { return countyLocations.indexOf(p.Location) >= 0; }),
		state: countySightingsTaxonomic[0]['State/Province'],
		sightingList: countySightingList,
		countySightingsTaxonomic: countySightingsTaxonomic,
		taxons: countySightingList.commonNames,
		customDayNames: gCustomDayNames,
	});
}

function renderTaxons() {
	var earliestByCommonName = gSightings.getEarliestByCommonName();
	var lifeSightingsTaxonomic = Object.keys(earliestByCommonName).map(function(k){ return earliestByCommonName[k]; });
	lifeSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	renderTemplate('taxons', 'Species', {
		lifeSightings: lifeSightingsTaxonomic,
	});
}

function renderTaxon(inCommonName) {
	var taxonSightings = gSightings.filter(function(s) { return s['Common Name'] == inCommonName; });
	taxonSightings.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });

	var taxonSightingsList = new SightingList(taxonSightings);

	var scientificName = taxonSightings[0]['Scientific Name'];

	renderTemplate('taxon', inCommonName, {
		name: inCommonName,
		showChart: taxonSightings.length > 30,
		photos: gPhotos.filter(function(p){return p['Scientific Name'] == scientificName;}),
		scientificName: scientificName,
		sightingsByMonth: taxonSightingsList.byMonth(),
		sightings: taxonSightings,
		chartID: 'bymonth' + Date.now(),
	});
}

function renderDebug() {
	var tmp = gSightings.filter(function(s) { return s['Location'] && s['Location'].indexOf('/') >= 0; });
	var brokenLocationSightingList = new SightingList(tmp);
	var photosBadScientificName = [];
	var missingSightingsForCustomDayNames = {};
	var allLocations = gSightings.getUniqueValues('Location');

	for (var index = 0; index < gPhotos.length; index++) {
		var photo = gPhotos[index];
		var sightings = gSightings.filter(function (s) { return s['Scientific Name'] == photo['Scientific Name']; });
		if (sightings.length == 0) {
			console.log('no sightings for scientific name ' + photo['Scientific Name']);
			photosBadScientificName.push(photo);
		}
	}

	for (index in gCustomDayNames) {
		var aCustomDate = gCustomDayNames[index];
		var sightings = gSightings.filter(function (s) { return s['Date'] == index; });
		if (sightings.length == 0) {
			console.log('no sightings for', index, aCustomDate);
			missingSightingsForCustomDayNames[index] = aCustomDate;
		}
	}

	renderTemplate('debug', 'Debug', {
		photosMissingTrip: gPhotos.filter(function(p) { return gSightings.dates.indexOf(p.Date) < 0; }),
		photosMissingLocation: gPhotos.filter(function(p) { return allLocations.indexOf(p.Location) < 0; }),
		photosBadScientificName: photosBadScientificName,
		photos: gPhotos,
		brokenLocations: brokenLocationSightingList.locations,
		missingSightingsForCustomDayNames: missingSightingsForCustomDayNames,
	});
}

function renderSearchResults(inTerm) {
	var rawResults = gIndex.search(inTerm);

	console.log('raw', rawResults);

    var resultsAsSightings = rawResults.map(function (result) {
		return gSightings.rows[result.ref];
    });

    var searchResultsSightingList = new SightingList(resultsAsSightings);

    console.log('search results', searchResultsSightingList);

	renderTemplate('searchresults', 'Search Results', {
		dates: searchResultsSightingList.dateObjects,
		customDayNames: gCustomDayNames,
		sightingList: searchResultsSightingList,
	});
}

var routingMap = {
	'#home' : renderHome,
	'#stats' : renderStats,
	'#chrono' : renderChrono,
	'#photos' : renderPhotos,
	'#photo' : renderPhoto,
	'#sighting' : renderSighting,
	'#bigdays' : renderBigDays,
	'#trips' : renderTrips,
	'#trip' : renderTrip,
	'#year' : renderYear,
	'#locations' : renderLocations,
	'#location' : renderLocation,
	'#county' : renderCounty,
	'#taxons' : renderTaxons,
	'#taxon' : renderTaxon,
	'#debug' : renderDebug,
	'#search' : renderSearchResults,
};

function routeBasedOnHash() {
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

function getText(url) {
	// Return a new promise.
	return new Promise(function(resolve, reject) {
	    // Do the usual XHR stuff
	    var req = new XMLHttpRequest();
	    req.open('GET', url);

	    req.onload = function() {
			// This is called even on 404 etc
			// so check the status
			if (req.status == 200) {
				// Resolve the promise with the response text
				resolve(req.response);
		    }
		    else {
		        // Otherwise reject with the status text
		        // which will hopefully be a meaningful error
		        reject(Error(req.statusText));
		    }
		};

	    // Handle network errors
	    req.onerror = function() {
			reject(Error('Network Error'));
	    };

	    // Make the request
	    req.send();
	});
}

function loadCustomDayNames() {
	return getText('./data/day-names.json').then(function(results) {
		gCustomDayNames = JSON.parse(results);
		console.log('loaded custom day names', Object.keys(gCustomDayNames).length);
	});
}

function loadOmittedCommonNames() {
	return getText('./data/omitted-common-names.json').then(function(results) {
		gOmittedCommonNames = JSON.parse(results);
		console.log('loaded omitted common names', Object.keys(gOmittedCommonNames).length);
	});
}

function loadPhotos() {
	return getText('./data/photos.json').then(function(results) {
		gPhotos = JSON.parse(results);
		console.log('loaded photos', Object.keys(gPhotos).length);

		for (var index = 0; index < gPhotos.length; index++)
		{
			var photo = gPhotos[index];

			// set the photos's ID as its index in this array.
			// TODO: not permanently stable
			photo.id = index;

			// Parse the date
			var pieces = photo['Date'].split('-');

			// order the pieces in a sensible way
			var fixedDateString = [pieces[0], '/', pieces[1], '/', pieces[2]].join('');

			// create and save the new dat
			var newDate = new Date(fixedDateString);
			photo['DateObject'] = newDate;
		}
	});
}

function registerHelpers() {
	Handlebars.registerHelper('nicedate', function(inDate) {
		if (inDate) {
			return new Handlebars.SafeString (
				d3.time.format('%b %d, %Y')(inDate)
			);
		} else {
			return new Handlebars.SafeString ('NaN');
		}
	});

	Handlebars.registerHelper('values', function(inList, inPropertyName) {
		return inList.getUniqueValues(inPropertyName);
	});

	Handlebars.registerHelper('valuecount', function(inList, inPropertyName) {
		return inList.getUniqueValues(inPropertyName).length;
	});

	Handlebars.registerHelper('multiplevalues', function(inList, inPropertyName) {
		return inList.getUniqueValues(inPropertyName).length > 1;
	});

	Handlebars.registerHelper('isnumber', function(inValue) {
		return !isNaN(inValue);
	});

	Handlebars.registerHelper('ebirddate', function(inDate) {
		return new Handlebars.SafeString (
			d3.time.format('%m-%d-%Y')(inDate)
		);
	});

	Handlebars.registerHelper('sortabledate', function(inDate) {
		return new Handlebars.SafeString (
			d3.time.format('%Y-%m-%d')(inDate)
		);
	});

	Handlebars.registerHelper('spacetodash', function(inString) {
		return new Handlebars.SafeString (
			inString.replace(' ', '-')
		);
	});

	Handlebars.registerHelper('spacetounder', function(inString) {
		return new Handlebars.SafeString (
			inString.replace(' ', '_')
		);
	});

	Handlebars.registerHelper('encode', function(inString) {
		return encodeURIComponent(inString);
	});

	Handlebars.registerPartial('thumbnails',
		'<div> \
		{{#each photos}} \
		  <span><a href="#photo/{{id}}"><img width="85px" height="85px" src="{{[Thumbnail URL]}}"></a></span> \
		{{/each}} \
		</div>'
	);

	Handlebars.registerHelper('nicenumber', function(inNumber) {
		return new Handlebars.SafeString (
			d3.format(',d')(inNumber)
		);
	});

	Handlebars.registerHelper('bargraph', function(inData, inElement) {
		// per @digitarald use timeout to reorder helper after Handlebars templating
		window.setTimeout(function () { barGraphCountsForSightings(inData, '#' + inElement); }, 1);
	});

	Handlebars.registerHelper('monthgraph', function(inData, inElement) {
		// per @digitarald use timeout to reorder helper after Handlebars templating
		window.setTimeout(function () { byMonthForSightings(inData, '#' + inElement); }, 1);
	});
}

function csvParse(file) {
	return new Promise(function(resolve, reject) {
		Papa.parse(file, {
			download: true,
			header: true,
			worker: true,
			complete: resolve,
			error: reject,
		});
	});
}

// REDIRECT to HTTPS!
var host = 'wfwalker.github.io';
if ((host == window.location.host) && (window.location.protocol != 'https:')) {
	window.location.protocol = 'https';
} else {
	document.addEventListener('DOMContentLoaded', function(event) { 
		registerHelpers();

		renderLoading();

		document.getElementById('gosearch').addEventListener('click', function() {
			var searchText = document.getElementById('searchtext').value;
			history.pushState({ searchText: searchText }, 'ebird-mybird | Search', '#search/' + searchText);
			routeBasedOnHash();
		});
	});

	Papa.SCRIPT_PATH = 'scripts/papaparse.js';

	csvParse(window.location.pathname + 'data/ebird.csv').then(function(results) {
		gSightings = new SightingList(results.data);
		gSightings.setGlobalIDs();
		routeBasedOnHash();
		gIndex = gSightings.createIndex();
	});

	window.onhashchange = routeBasedOnHash;

	loadCustomDayNames();
	loadOmittedCommonNames();
	loadPhotos();
}


