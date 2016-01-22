'use strict';

var gSightings = null;
var gOmittedCommonNames = [];
var gCustomDayNames = [];
var gPhotos = [];
var gCompiledTemplates = {};
var gCountyByLocation = {};
var gIndex = lunr(function () {
    this.field('body');
    this.ref('id');
});

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
			reject(Error("Network Error"));
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
			renderSearchResults(searchText);
		});
	});

	Papa.SCRIPT_PATH = 'scripts/papaparse.js';

	csvParse(window.location.pathname + 'data/ebird.csv').then(function(results) {
		gSightings = new SightingList(results.data);
		gSightings.setGlobalIDs();
		routeBasedOnHash();
		gSightings.addToIndex(gIndex);
	});

	window.onhashchange = routeBasedOnHash;

	loadCustomDayNames();
	loadOmittedCommonNames();
	loadPhotos();
}


