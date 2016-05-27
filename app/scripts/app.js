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
};

var gCompiledTemplates = {};

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
	var photosThisWeekRequest = new XMLHttpRequest();

	photosThisWeekRequest.onload = function(e) {
		console.log('home loaded');

		var tmp = JSON.parse(photosThisWeekRequest.response);
		var photosThisWeekData = new SightingList(tmp);

		console.log(photosThisWeekData);
		renderTemplate('home', 'Home', {
			photoOfTheWeek: photosThisWeekData.rows.pop(),
			owner: 'Bill Walker',
		});
	}

	photosThisWeekRequest.open("GET", '/photosThisWeek');
	photosThisWeekRequest.send();
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
	var tripsRequest = new XMLHttpRequest();

	tripsRequest.onload = function(e) {
		console.log('trips loaded');

		// TODO: need special magic decorator around JSON.parse that reinflates DateObjects
		
		var tripsData = JSON.parse(tripsRequest.response);
		for (var index = 0; index < tripsData.trips.length; index++) {
			tripsData.trips[index] = new Date(tripsData.trips[index]);
		}
		renderTemplate('trips', 'Trips', tripsData);
	}

	tripsRequest.open("GET", '/trips');
	tripsRequest.send();
}

function renderBigDays() {
	var speciesByDate = gSightings.getSpeciesByDate();
	var bigDays = Object.keys(speciesByDate).map(function (key) { return [key, speciesByDate[key]]; });
	var bigDays = bigDays.filter(function (x) { return x[1].commonNames.length > 100; });
	bigDays = bigDays.map(function (x) { return { date: x[0], dateObject: x[1].dateObject, count: x[1].commonNames.length }; });
	bigDays.sort(function (x,y) { return y.count - x.count; } );

	renderTemplate('bigdays', 'Big Days', {
		bigDays: bigDays,
		customDayNames: gCustomDayNames,
	});
}

function renderTrip(inDate) {
	var tripRequest = new XMLHttpRequest();

	tripRequest.onload = function(e) {
		console.log('trip loaded');

		var tmp = JSON.parse(tripRequest.response);
		var tripSightingList = new SightingList();
		tripSightingList.initialize(tmp);

		renderTemplate('trip', inDate, {
			tripDate: tripSightingList.rows[0].DateObject,
			photos: tripSightingList.photos,
			customName: tripSightingList.dayNames[0],
			comments: tripSightingList.getUniqueValues('Checklist Comments'),
			sightingList: tripSightingList,
		});
	};

	tripRequest.open("GET", '/trip/' + inDate);
	tripRequest.send();
}

function renderYear(inYear) {
	var yearRequest = new XMLHttpRequest();

	yearRequest.onload = function(e) {
		console.log('year loaded');

		var tmp = JSON.parse(yearRequest.response);
		var yearSightingList = new SightingList();
		yearSightingList.initialize(tmp);

		renderTemplate('year', inYear, {
			year: inYear,
			photos: yearSightingList.photos,
			yearSightings: yearSightingList.rows,
			yearSpecies: yearSightingList.getUniqueValues('Common Name'),
		});
	};

	yearRequest.open("GET", '/year/' + inYear);
	yearRequest.send();
}

function renderSighting(inID) {
	var sightingRequest = new XMLHttpRequest();

	sightingRequest.onload = function (e) {
		var sighting = JSON.parse(sightingRequest.response);
		sighting.DateObject = new Date(sighting.DateObject);

		renderTemplate('sighting', sighting['Common Name'],
			sighting
		);
	};

	sightingRequest.open('GET', '/sighting/' + inID);
	sightingRequest.send();
}

function renderPhoto(inID) {
	renderTemplate('photo', gPhotos[inID]['Common Name'],
		gPhotos[inID]
	);
}

function renderPhotos() {
	var photoCommonNames = {};
	var earliestByCommonName = gSightings.getEarliestByCommonName();

	for (var index = 0; index < gPhotos.length; index++) {
		var aValue = gPhotos[index]['Common Name'];
		if (! photoCommonNames[aValue]) {
			if (earliestByCommonName[aValue]) {
				photoCommonNames[aValue] = earliestByCommonName[aValue]['Taxonomic Order'];
			} else {
				console.log('cant find taxo order', aValue);
			}
		}
	}

	var pairs = Object.keys(photoCommonNames).map(function(key) { return [key, photoCommonNames[key]]; });
	pairs.sort(function (x, y) { return x[1] - y[1]; });

	console.log('photo sort', photoCommonNames);

	renderTemplate('photos', 'Photos', {
		photos: gPhotos,
		photoCommonNames: pairs.map(function (x) { return x[0]; }),
	});
}

function renderLocations() {
	renderTemplate('locations', 'Locations', {
		count: gSightings.getUniqueValues('Location').length,
		hierarchy: gSightings.getLocationHierarchy(),
	});
}

function renderLocation(inLocationName) {
	var locationRequest = new XMLHttpRequest();

	locationRequest.onload = function(e) {
		console.log('location loaded');

		var tmp = JSON.parse(locationRequest.response);
		var locationSightingList = new SightingList();
		locationSightingList.initialize(tmp);

		renderTemplate('location', inLocationName, {
			name: inLocationName,
			chartID: 'bymonth' + Date.now(),
			showChart: locationSightingList.length() > 100,
			sightingsByMonth: locationSightingList.byMonth(),
			photos: locationSightingList.photos,
			sightingList: locationSightingList,
		});

	}

	locationRequest.open("GET", '/location/' + inLocationName);
	locationRequest.send();
}

function renderCounty(inCountyName) {
	var countyRequest = new XMLHttpRequest();

	countyRequest.onload = function(e) {
		console.log('county loaded');

		var tmp = JSON.parse(countyRequest.response);
		var countySightingList = new SightingList();
		countySightingList.initialize(tmp);

		renderTemplate('county', inCountyName + ' County', {
			name: inCountyName,
			chartID: 'bymonth' + Date.now(),
			sightingsByMonth: countySightingList.byMonth(),
			photos: countySightingList.photos,
			state: countySightingList.rows[0]['State/Province'],
			sightingList: countySightingList,
			taxons: countySightingList.commonNames,
		});
	}

	countyRequest.open("GET", '/county/' + inCountyName);
	countyRequest.send();
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
	var taxonRequest = new XMLHttpRequest();

	taxonRequest.onload = function(e) {
		console.log('taxon loaded');

		var tmp = JSON.parse(taxonRequest.response);
		var taxonSightingList = new SightingList();
		taxonSightingList.initialize(tmp);
		var scientificName = taxonSightingList.rows[0]['Scientific Name'];

		renderTemplate('taxon', inCommonName, {
			name: inCommonName,
			showChart: taxonSightingList.length() > 30,
			scientificName: scientificName,
			sightingsByMonth: taxonSightingList.byMonth(),
			photos: taxonSightingList.photos,
			sightingList: taxonSightingList,
			chartID: 'bymonth' + Date.now(),
		});

	}

	taxonRequest.open("GET", '/taxon/' + inCommonName);
	taxonRequest.send();
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

// REDIRECT to HTTPS!
var host = 'wfwalker.github.io';
if ((host == window.location.host) && (window.location.protocol != 'https:')) {
	window.location.protocol = 'https';
} else {
	document.addEventListener('DOMContentLoaded', function(event) { 
		registerHelpers();

		document.getElementById('gosearch').addEventListener('click', function() {
			var searchText = document.getElementById('searchtext').value;
			history.pushState({ searchText: searchText }, 'ebird-mybird | Search', '#search/' + searchText);
			routeBasedOnHash();
		});
	});

	gSightings = [];

	routeBasedOnHash();

	window.onhashchange = routeBasedOnHash;
}


