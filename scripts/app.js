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

var gBarGraphHeight = 100;

function renderNetworkError(e) {
	console.log('network error', e);
	hideSection('#loading');
	alert('network error, please try again');
	// TODO: show error something?
}

function renderTemplate(inPrefix, inPageTitle, inData) {
	console.log('DONE LOADING', inPrefix);
	hideSection('#loading');

	var compiledTemplate = ebirdmybird[inPrefix];

	if (compiledTemplate == null) {
		throw new Error('missing template "' + inPrefix + '"');
	}

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
	document.title = 'BirdWalker | ' + inPageTitle;
}


function showSection(inSelector) {
	var sections = document.querySelectorAll(inSelector);
	for (var index = 0; index < sections.length; index++) {
		sections[index].classList.remove('hidden');
		sections[index].classList.add('visible');
	}
}

function hideSection(inSelector) {
	var sections = document.querySelectorAll(inSelector);
	for (var index = 0; index < sections.length; index++) {
		sections[index].classList.remove('visible');
		sections[index].classList.add('hidden');
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
			height: gBarGraphHeight,
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
			height: gBarGraphHeight,
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
	};

	photosThisWeekRequest.onerror = renderNetworkError;
	photosThisWeekRequest.open('GET', '/photosThisWeek');
	photosThisWeekRequest.send();
}

function renderLoading() {
	renderTemplate('loading', 'Loading', {
		owner: 'Bill Walker',
	});
}

function renderChrono() {
	var chronoRequest = new XMLHttpRequest();

	chronoRequest.onload = function(e) {
		console.log('chrono loaded');

		// TODO: need special magic decorator around JSON.parse that reinflates DateObjects
		
		var chronoData = JSON.parse(chronoRequest.response);
		for (var index = 0; index < chronoData.firstSightings.length; index++) {
			chronoData.firstSightings[index]['DateObject'] = new Date(chronoData.firstSightings[index]['DateObject']);
		}
		chronoData.firstSightings.sort(function(a, b) { return b['DateObject'] - a['DateObject']; });
		renderTemplate('chrono', 'chrono', chronoData);
	};

	chronoRequest.onerror = renderNetworkError;
	chronoRequest.open('GET', '/chrono');
	chronoRequest.send();
}

function renderTrips() {
	var tripsRequest = new XMLHttpRequest();

	tripsRequest.onload = function(e) {
		console.log('trips loaded');

		// TODO: need special magic decorator around JSON.parse that reinflates DateObjects
		
		var tripsData = JSON.parse(tripsRequest.response);
		for (var index = 0; index < tripsData.trips.length; index++) {
			var tmp = new Date(tripsData.trips[index]);
			tmp.setTime( tmp.getTime() + tmp.getTimezoneOffset()*60*1000 );
			tripsData.trips[index] = tmp;
		}
		renderTemplate('trips', 'Trips', tripsData);
	};

	tripsRequest.onerror = renderNetworkError;
	tripsRequest.open('GET', '/trips');
	tripsRequest.send();
}

function renderBigDays() {

	var bigDaysRequest = new XMLHttpRequest();

	bigDaysRequest.onload = function(e) {
		// TODO: need special magic decorator around JSON.parse that reinflates DateObjects
		
		var bigDaysData = JSON.parse(bigDaysRequest.response);

		for (var index = 0; index < bigDaysData.bigDays.length; index++) {
			// TODO: different capitalization of dateObject
			bigDaysData.bigDays[index]['dateObject'] = new Date(bigDaysData.bigDays[index]['dateObject']);
		}

		renderTemplate('bigdays', 'Big Days', bigDaysData);
	};

	bigDaysRequest.onerror = renderNetworkError;
	bigDaysRequest.open('GET', '/bigDays');
	bigDaysRequest.send();
}

function renderTrip(inHashParts) {
	var tripRequest = new XMLHttpRequest();
	var inDate = decodeURI(inHashParts[1]);

	tripRequest.onload = function(e) {
		console.log('trip loaded');

		var tmp = JSON.parse(tripRequest.response);
		var tripSightingList = new SightingList();
		tripSightingList.initialize(tmp);

		renderTemplate('trip', inDate, {
			tripDate: tripSightingList.rows[0].DateObject,
			photos: tripSightingList.photos,
			customName: tripSightingList.dayNames[0],
			submissionIDToChecklistComments: tripSightingList.mapSubmissionIDToChecklistComments(),
			submissionIDToLocation: tripSightingList.mapSubmissionIDToLocation(),
			comments: tripSightingList.getUniqueValues('Checklist Comments'),
			sightingList: tripSightingList,
		});
	};

	tripRequest.onerror = renderNetworkError;
	tripRequest.open('GET', '/trip/' + inDate);
	tripRequest.send();
}

function renderYear(inHashParts) {
	var yearRequest = new XMLHttpRequest();
	var inYear = decodeURI(inHashParts[1]);

	yearRequest.onload = function(e) {
		console.log('year loaded');

		var tmp = JSON.parse(yearRequest.response);
		var yearSightingList = new SightingList();
		yearSightingList.initialize(tmp);

		renderTemplate('year', inYear, {
			year: inYear,
			photos: yearSightingList.getLatestPhotos(20),
			yearSightings: yearSightingList.rows,
			yearSpecies: yearSightingList.getUniqueValues('Common Name'),
		});
	};

	yearRequest.onerror = renderNetworkError;
	yearRequest.open('GET', '/year/' + inYear);
	yearRequest.send();
}

function renderSighting(inHashParts) {
	var sightingRequest = new XMLHttpRequest();
	var inSightingID = decodeURI(inHashParts[1]);

	sightingRequest.onload = function (e) {
		var sighting = JSON.parse(sightingRequest.response);
		sighting.DateObject = new Date(sighting.DateObject);

		renderTemplate('sighting', sighting['Common Name'],
			sighting
		);
	};

	sightingRequest.onerror = renderNetworkError;
	sightingRequest.open('GET', '/sighting/' + inSightingID);
	sightingRequest.send();
}


function renderPhoto(inHashParts) {
	var photoRequest = new XMLHttpRequest();
	var inPhotoID = decodeURI(inHashParts[1]);

	photoRequest.onload = function (e) {
		var photo = JSON.parse(photoRequest.response);
		photo['DateObject'] = new Date(photo['DateObject']);

		renderTemplate('photo', photo['Common Name'],
			photo
		);
	};

	photoRequest.onerror = renderNetworkError;
	photoRequest.open('GET', '/photo/' + inPhotoID);
	photoRequest.send();
}

function renderPhotos() {
	var photosRequest = new XMLHttpRequest();

	photosRequest.onload = function (e) {
		var photos = JSON.parse(photosRequest.response);

		renderTemplate('photos', 'Photos',
			photos
		);
	};

	photosRequest.onerror = renderNetworkError;
	photosRequest.open('GET', '/photos');
	photosRequest.send();
}

function renderLocations() {
	var locationsRequest = new XMLHttpRequest();

	locationsRequest.onload = function(e) {
		console.log('locations loaded');

		var locationsData = JSON.parse(locationsRequest.response);
		renderTemplate('locations', 'locations', locationsData);
	};

	locationsRequest.onerror = renderNetworkError;
	locationsRequest.open('GET', '/locations');
	locationsRequest.send();
}

function renderPlace(inHashParts) {
	if (inHashParts.length == 4) {
		renderLocation(inHashParts);
	} else if (inHashParts.length == 3) {
		renderCounty(inHashParts);
	} else if (inHashParts.length == 2) {
		// TODO: not done yet
		renderState(inHashParts);
	} else {
		throw new Error('missing arguments to render place', inHashParts);
	}
}

function renderLocation(inHashParts) {
	var locationRequest = new XMLHttpRequest();
	var inStateName = decodeURI(inHashParts[1]);
	var inCountyName = decodeURI(inHashParts[2]);
	var inLocationName = decodeURI(inHashParts[3]);

	locationRequest.onload = function(e) {
		console.log('location loaded', inStateName, inCountyName, inLocationName);

		var tmp = JSON.parse(locationRequest.response);
		var locationSightingList = new SightingList();
		locationSightingList.initialize(tmp);

		renderTemplate('location', inLocationName, {
			name: inLocationName,
			chartID: 'bymonth' + Date.now(),
			showChart: locationSightingList.length() > 100,
			sightingsByMonth: locationSightingList.byMonth(),
			photos: locationSightingList.getLatestPhotos(20),
			sightingList: locationSightingList,
		});

	};

	locationRequest.onerror = renderNetworkError;
	locationRequest.open('GET', '/place/' + inStateName + '/' + inCountyName + '/' + inLocationName);
	locationRequest.send();
}

function renderCounty(inHashParts) {
	var countyRequest = new XMLHttpRequest();
	var inStateName = decodeURI(inHashParts[1]);
	var inCountyName = decodeURI(inHashParts[2]);

	countyRequest.onload = function(e) {
		console.log('county loaded');

		var tmp = JSON.parse(countyRequest.response);
		var countySightingList = new SightingList();
		countySightingList.initialize(tmp);

		renderTemplate('county', inCountyName + ' County', {
			name: inCountyName,
			chartID: 'bymonth' + Date.now(),
			sightingsByMonth: countySightingList.byMonth(),
			photos: countySightingList.getLatestPhotos(20),
			State: countySightingList.rows[0]['State/Province'],
			Region: countySightingList.rows[0]['Region'],
			Country: countySightingList.rows[0]['Country'],
			sightingList: countySightingList,
			taxons: countySightingList.commonNames,
		});
	};

	countyRequest.onerror = renderNetworkError;
	countyRequest.open('GET', '/place/' + inStateName + '/' + inCountyName);
	countyRequest.send();
}


function renderState(inHashParts) {
	var stateRequest = new XMLHttpRequest();
	var inStateName = decodeURI(inHashParts[1]);

	stateRequest.onload = function(e) {
		console.log('county loaded');

		var tmp = JSON.parse(stateRequest.response);
		var stateSightingList = new SightingList();
		stateSightingList.initialize(tmp);

		renderTemplate('state', inStateName, {
			name: inStateName,
			chartID: 'bymonth' + Date.now(),
			sightingsByMonth: stateSightingList.byMonth(),
			photos: stateSightingList.getLatestPhotos(20),
			State: stateSightingList.rows[0]['State/Province'],
			Country: stateSightingList.rows[0]['Country'],
			sightingList: stateSightingList,
			taxons: stateSightingList.commonNames,
		});
	};

	stateRequest.onerror = renderNetworkError;
	stateRequest.open('GET', '/place/' + inStateName);
	stateRequest.send();
}

function renderFamily(inHashParts) {
	var familyRequest = new XMLHttpRequest();
	var inFamilyName = decodeURI(inHashParts[1]);

	familyRequest.onload = function(e) {
		console.log('county loaded');

		var tmp = JSON.parse(familyRequest.response);
		var familySightingList = new SightingList();
		familySightingList.initialize(tmp);

		renderTemplate('family', inFamilyName, {
			name: inFamilyName,
			chartID: 'bymonth' + Date.now(),
			sightingsByMonth: familySightingList.byMonth(),
			photos: familySightingList.getLatestPhotos(20),
			sightingList: familySightingList,
			taxons: familySightingList.commonNames,
		});
	};

	familyRequest.onerror = renderNetworkError;
	familyRequest.open('GET', '/family/' + inFamilyName);
	familyRequest.send();
}

function renderTaxons() {
	var taxonsRequest = new XMLHttpRequest();

	taxonsRequest.onload = function(e) {
		console.log('taxons loaded');

		var taxonsData = JSON.parse(taxonsRequest.response);
		renderTemplate('taxons', 'Species', taxonsData);
	};

	taxonsRequest.onerror = renderNetworkError;
	taxonsRequest.open('GET', '/taxons');
	taxonsRequest.send();
}

function renderTaxon(inHashParts) {
	var taxonRequest = new XMLHttpRequest();
	var inCommonName = decodeURI(inHashParts[1]);

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

	};

	taxonRequest.onerror = renderNetworkError;
	taxonRequest.open('GET', '/taxon/' + inCommonName);
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

function renderSearchResults(inHashParts) {
	var searchRequest = new XMLHttpRequest();
	var inTerm = decodeURI(inHashParts[1]);

	searchRequest.onload = function(e) {
		var searchData = JSON.parse(searchRequest.response);
		var tmp = new SightingList();
		tmp.initialize(searchData.sightingList);
		console.log('initalized sighting list', tmp);
		searchData.sightingList = tmp;

		for (var index = 0; index < searchData.dates.length; index++) {
			searchData.dates[index] = new Date(searchData.dates[index]);
		}

		console.log('search loaded', searchData);
		renderTemplate('searchresults', 'Search Results', searchData);
	};

	searchRequest.onerror = renderNetworkError;
	searchRequest.open('GET', '/search/' + inTerm);
	searchRequest.send();
}

var routingMap = {
	'#home' : renderHome,
	'#chrono' : renderChrono,
	'#photos' : renderPhotos,
	'#photo' : renderPhoto,
	'#sighting' : renderSighting,
	'#bigdays' : renderBigDays,
	'#trips' : renderTrips,
	'#trip' : renderTrip,
	'#year' : renderYear,
	'#locations' : renderLocations,
	'#place' : renderPlace,
	'#taxons' : renderTaxons,
	'#taxon' : renderTaxon,
	'#family' : renderFamily,
	'#search' : renderSearchResults,
};

function routeBasedOnHash() {
	// On every hash change the render function is called with the new hash.
	// This is how the navigation of our app happens.
	var theHashParts = window.location.hash.split('/');
	console.log('LOADING', theHashParts[0], theHashParts[1]);
	showSection('#loading');

	if (! theHashParts[0]) {
		// TODO: should use push state
		theHashParts[0] = '#home';
	}

	if(routingMap[theHashParts[0]]) {
		// TODO: hard coded to a single parameter, won't work for location hierarchy

		// routingMap[theHashParts[0]](decodeURI(theHashParts[1]));
		routingMap[theHashParts[0]](theHashParts);
	} else {
		console.log('not found', window.location.hash);
	}	
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

	Handlebars.registerHelper('locations', function(inList) {
		var triples = [];
		var tmp = [];

		for (var index = 0; index < inList.rows.length; index++) {
			var row = inList.rows[index];
			var triple = [row['State/Province'], row['County'], row['Location']];
			var code = triple.join('-');

			if (tmp.indexOf(code) == -1) {
				triples.push(triple);
				tmp.push(code);
			}
		}

		return triples;
	});

	Handlebars.registerHelper('lookupState', function(inString) {
		console.log('lookupState', inString);
		if (inString == '') {
			return 'None';
		} else if (! iso3166.subdivision(inString).name) {
			return inString;
		} else {
			return iso3166.subdivision(inString).name;
		}
	});

	Handlebars.registerHelper('addnone', function(inString) {
		if (inString == '') {
			return 'none';
		} else {
			return inString;
		}
	});

	Handlebars.registerHelper('random', function(inDictionary, inKey) {
		var tmp = inDictionary[inKey].length;
		return inDictionary[inKey][Math.trunc(Math.random() * tmp)];
	});

	Handlebars.registerHelper('stripLatinFromEbirdFamily', function(inString) {
		return inString.replace(/.*\((.*)\)/, '$1');
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
			inString.toLowerCase().replace(' ', '-')
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
			history.pushState({ searchText: searchText }, 'BirdWalker | Search', '#search/' + searchText);
			routeBasedOnHash();
		});
	});

	gSightings = [];

	routeBasedOnHash();

	window.onhashchange = routeBasedOnHash;
}


