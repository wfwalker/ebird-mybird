'use strict';

var gSightings = null;
var gOmittedCommonNames = [];
var gCustomDayNames = [];
var gPhotos = [];
var gCompiledTemplates = {};
var gCountyByLocation = {};

function renderTemplate(inPrefix, inData) {
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

    // hide loading section
	document.getElementById('loading').classList.remove('visible');
	document.getElementById('loading').classList.add('hidden');

	hideAllSections();

	// show rendered template
    results.appendChild(newDiv);
	showSection('section#' + inPrefix);
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
	});
}

function renderHome() {
	renderTemplate('home', {
		numSightings: gSightings.count(),
		sightingsByYear: gSightings.byYear(),
		sightingsByMonth: gSightings.byMonth(),
		yearChartID: 'byYear' + Date.now(),
		monthChartID: 'byMonth' + Date.now(),
		numChecklists: gSightings.checklists.length,
		earliest: gSightings.earliestDateObject,
		latest: gSightings.latestDateObject,
		owner: 'Bill Walker',
	});
}

function renderChrono() {
	var earliestByCommonName = gSightings.earliestByCommonName();
	var lifeSightingsChronological = Object.keys(earliestByCommonName).map(function(k) { return earliestByCommonName[k]; });
	lifeSightingsChronological.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });

	renderTemplate('chrono', {
		firstSightings: lifeSightingsChronological,
	});
}

function renderTrips() {
	renderTemplate('trips', {
		trips: gSightings.dateObjects,
		customDayNames: gCustomDayNames,
	});
}

function renderTrip(inDate) {
	var tripSightings = gSightings.filter(function(s) { return s['Date'] == inDate; });
	var tripSightingList = new SightingList(tripSightings);

	renderTemplate('trip', {
		tripDate: tripSightings[0].DateObject,
		photos: gPhotos.filter(function(p){return p.Date == inDate;}),
		customName: gCustomDayNames[inDate],
		comments: tripSightingList.getUniqueValues('Checklist Comments'),
		taxons: tripSightingList.getUniqueValues('Common Name'),
		sightingList: tripSightingList,
	});
}

function renderYear(inYear) {
	var yearSightings = gSightings.byYear()[inYear];
	yearSightings.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var yearSightingList = new SightingList(yearSightings);

	renderTemplate('year', {
		year: inYear,
		photos: gPhotos.filter(function(p){return p.Date.substring(6,10) == inYear;}),
		yearSightings: yearSightings,
		yearSpecies: yearSightingList.getUniqueValues('Common Name'),
	});
}

function renderPhoto(inID) {
	renderTemplate('photo',
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

	renderTemplate('photos', {
		photos: gPhotos,
		photoCommonNames: photoCommonNames,
	});
}

function renderLocations() {
	renderTemplate('locations', {
		locations: gSightings.locations,
	});
}

function renderLocation(inLocationName) {
	var locationSightingsTaxonomic = gSightings.filter(function(s) { return s['Location'] == inLocationName; });
	locationSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	var locationSightingList = new SightingList(locationSightingsTaxonomic);

	renderTemplate('location', {
		name: inLocationName,
		chartID: 'bymonth' + Date.now(),
		sightingsByMonth: locationSightingList.byMonth(),
		photos: gPhotos.filter(function(p) { return p.Location == inLocationName; }),
		county: locationSightingsTaxonomic[0]['County'],
		state: locationSightingsTaxonomic[0]['State/Province'],
		locationSightingsTaxonomic: locationSightingsTaxonomic,
		longitude: locationSightingsTaxonomic[0]['Longitude'],
		latitude: locationSightingsTaxonomic[0]['Latitude'],
		sightingList: locationSightingList,
		taxons: locationSightingList.getUniqueValues('Common Name'),
		customDayNames: gCustomDayNames,
	});
}

function renderCounty(inCountyName) {
	var countySightingsTaxonomic = gSightings.filter(function(s) { return s['County'] == inCountyName; });
	countySightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	var countySightingList = new SightingList(countySightingsTaxonomic);

	renderTemplate('county', {
		name: inCountyName,
		chartID: 'bymonth' + Date.now(),
		sightingsByMonth: countySightingList.byMonth(),
		photos: gPhotos.filter(function(p) { return countySightingList.locations.indexOf(p.Location) >= 0; }),
		state: countySightingsTaxonomic[0]['State/Province'],
		sightingList: countySightingList,
		countySightingsTaxonomic: countySightingsTaxonomic,
		taxons: countySightingList.getUniqueValues('Common Name'),
		customDayNames: gCustomDayNames,
	});
}

function renderTaxons() {
	var earliestByCommonName = gSightings.earliestByCommonName();
	var lifeSightingsTaxonomic = Object.keys(earliestByCommonName).map(function(k){ return earliestByCommonName[k]; });
	lifeSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	renderTemplate('taxons', {
		lifeSightings: lifeSightingsTaxonomic,
	});
}

function renderTaxon(inCommonName) {
	var taxonSightings = gSightings.filter(function(s) { return s['Common Name'] == inCommonName; });
	taxonSightings.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });

	var taxonSightingsList = new SightingList(taxonSightings);

	var scientificName = taxonSightings[0]['Scientific Name'];

	renderTemplate('taxon', {
		name: inCommonName,
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

	renderTemplate('debug', {
		photosMissingTrip: gPhotos.filter(function(p) { return gSightings.dates.indexOf(p.Date) < 0; }),
		photosMissingLocation: gPhotos.filter(function(p) { return gSightings.locations.indexOf(p.Location) < 0; }),
		photosBadScientificName: photosBadScientificName,
		photos: gPhotos,
		brokenLocations: brokenLocationSightingList.getUniqueValues('Location'),
		missingSightingsForCustomDayNames: missingSightingsForCustomDayNames,
	});
}

var routingMap = {
	'#home' : renderHome,
	'#chrono' : renderChrono,
	'#photos' : renderPhotos,
	'#photo' : renderPhoto,
	'#trips' : renderTrips,
	'#trip' : renderTrip,
	'#year' : renderYear,
	'#locations' : renderLocations,
	'#location' : renderLocation,
	'#county' : renderCounty,
	'#taxons' : renderTaxons,
	'#taxon' : renderTaxon,
	'#debug' : renderDebug,
};

function routeBasedOnHash() {
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
	oReq.addEventListener('load', function() {
	  gCustomDayNames = JSON.parse(this.responseText);
	  console.log('loaded custom day names', Object.keys(gCustomDayNames).length);
	});
	oReq.open('GET', './data/day-names.json');
	oReq.send();
}

function loadOmittedCommonNames() {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener('load', function() {
	  gOmittedCommonNames = JSON.parse(this.responseText);
	  console.log('loaded omitted common names', gOmittedCommonNames.length);
	});
	oReq.open('GET', './data/omitted-common-names.json');
	oReq.send();
}

function loadPhotos() {
	var oReq = new XMLHttpRequest();
	oReq.addEventListener('load', function() {
		gPhotos = JSON.parse(this.responseText);
		for (var index = 0; index < gPhotos.length; index++)
		{
			gPhotos[index].id = index;
		}
		console.log('loaded photos', gPhotos.length, gPhotos);
	});
	oReq.open('GET', './data/photos.json');
	oReq.send();
}

function registerHelpers() {
	Handlebars.registerHelper('nicedate', function(inDate) {
		return new Handlebars.SafeString (
			d3.time.format('%b %d, %Y')(inDate)
		);
	});

	Handlebars.registerHelper('ebirddate', function(inDate) {
		return new Handlebars.SafeString (
			d3.time.format('%m-%d-%Y')(inDate)
		);
	});

	Handlebars.registerPartial('thumbnails',
		'<div>
		{{#each photos}}
		  <span><a href="#photo/{{id}}"><img width="85px" height="85px" src="{{[Thumbnail URL]}}"></a></span>
		{{/each}}
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

// REDIRECT to HTTPS!
var host = 'wfwalker.github.io';
if ((host == window.location.host) && (window.location.protocol != 'https:')) {
	window.location.protocol = 'https';
} else {
	document.addEventListener('DOMContentLoaded', function(event) { 
		registerHelpers();
	});

	Papa.parse('./data/ebird.csv', {
		download: true,
		header: true,
		complete: function(results) {
			gSightings = new SightingList(results.data);
			routeBasedOnHash();
		},
	});

	window.onhashchange = routeBasedOnHash;

	loadCustomDayNames();
	loadOmittedCommonNames();
	loadPhotos();
}

