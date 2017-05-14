// server.js

var gSightingList = null;
var gPhotos = [];
var gEBirdAll = [];
var gIndex = null;

var express = require('express');
var compression = require('compression');
var expires = require('expires-middleware');
var Handlebars = require('handlebars');
var lunr = require('lunr');
var iso3166 = require('iso-3166-2');
var babyParse = require('babyparse');
var SightingList = require('../app/scripts/sightinglist.js');
var fs = require('fs');
var winston = require('winston');
var request = require('request');
var d3 = require('../app/scripts/d3.js');
var { URL, URLSearchParams } = require('url');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
		'timestamp': true,
		'level': 'debug'
      })
    ]
});

var gTemplates = {
	photo: Handlebars.compile(fs.readFileSync('server/templates/photo.html', 'UTF-8')),
	trips: Handlebars.compile(fs.readFileSync('server/templates/trips.html', 'UTF-8')),
	trip: Handlebars.compile(fs.readFileSync('server/templates/trip.html', 'UTF-8')),
	sighting: Handlebars.compile(fs.readFileSync('server/templates/sighting.html', 'UTF-8')),
	taxon: Handlebars.compile(fs.readFileSync('server/templates/taxon.html', 'UTF-8')),
	taxons: Handlebars.compile(fs.readFileSync('server/templates/taxons.html', 'UTF-8')),
	family: Handlebars.compile(fs.readFileSync('server/templates/family.html', 'UTF-8')),
	location: Handlebars.compile(fs.readFileSync('server/templates/location.html', 'UTF-8')),
	photos: Handlebars.compile(fs.readFileSync('server/templates/photos.html', 'UTF-8')),
	county: Handlebars.compile(fs.readFileSync('server/templates/county.html', 'UTF-8')),
	state: Handlebars.compile(fs.readFileSync('server/templates/state.html', 'UTF-8')),
	locations: Handlebars.compile(fs.readFileSync('server/templates/locations.html', 'UTF-8')),
	bigdays: Handlebars.compile(fs.readFileSync('server/templates/bigdays.html', 'UTF-8')),
	chrono: Handlebars.compile(fs.readFileSync('server/templates/chrono.html', 'UTF-8')),
	year: Handlebars.compile(fs.readFileSync('server/templates/year.html', 'UTF-8')),
}

Handlebars.registerPartial('head', fs.readFileSync('server/templates/head.html', 'UTF-8'));
Handlebars.registerPartial('foot', fs.readFileSync('server/templates/foot.html', 'UTF-8'));

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
		if (inString == null || inString == '') {
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
		'<div class="mygallery"> \
		{{#each photos}} \
		  <a href="/photo/{{id}}"><img alt="{{[Common Name]}}" src="{{[Photo URL]}}"></a> \
		{{/each}} \
		</div>'
	);

	Handlebars.registerPartial('specieslist',
		'<div class="biglist"> \
		{{#each (values sightingList "Common Name")}} \
		  <div class="biglist-item"> \
		    <a href="/taxon/{{encode this}}">{{this}}</a> \
		  </div> \
		{{/each}} \
		</div>'
	);

	Handlebars.registerHelper('nicenumber', function(inNumber) {
		return new Handlebars.SafeString (
			d3.format(',d')(inNumber)
		);
	});

	Handlebars.registerHelper('googlemap', function(inData, inElement) {
		let mapsURL = new URL('https://maps.googleapis.com/maps/api/staticmap');
		mapsURL.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY);
		mapsURL.searchParams.append('size', '640x360');
		let markers = inData.rows.map(row => row.Latitude + ',' + row.Longitude)
		mapsURL.searchParams.append('markers', markers.join('|'));

		return new Handlebars.SafeString('<img src="' + mapsURL.toString() + '">');
	});

	Handlebars.registerHelper('monthgraph', function(inData, inElement) {
		// per @digitarald use timeout to reorder helper after Handlebars templating
		// byMonthForSightings(inData, '#' + inElement);

		let chartURL = new URL('https://chart.googleapis.com/chart');
		chartURL.searchParams.append('chxt', 'x,y');
		chartURL.searchParams.append('cht', 'bvs');
		let counts = inData.map(d => d.length);
		let axisRange = [0, 0, 12, 12];
		chartURL.searchParams.append('chd', 't:' + counts.join(','));
		chartURL.searchParams.append('chxr', axisRange.join(','));
		chartURL.searchParams.append('chco', '76A4FB');
		chartURL.searchParams.append('chls', '2.0');
		chartURL.searchParams.append('chs', '360x200');

		console.log(chartURL);	

		return new Handlebars.SafeString('<img src="' + chartURL.toString() + '">');
	});
}

registerHelpers();


var myPort = process.env.PORT || 8091;
var mHost = process.env.VCAP_APP_HOST || "127.0.0.1";

var app = express();

app.use(compression());
app.use(expires('24h'));

app.listen(myPort);

// static styles folder
app.use('/styles', express.static('server/styles'));
app.use('/scripts', express.static('server/scripts'));
app.use('/images', express.static('server/images'));

// parse the ebird data so we can make a REST API for it

fs.readFile('server/data/day-names.json', 'utf8', function(err, data) {
	if (err) throw err;

	SightingList.setCustomDayNames(JSON.parse(data));
	logger.info('loaded custom day names', Object.keys(SightingList.customDayNames).length);
});

fs.readFile('server/data/omitted-common-names.json', 'utf8', function(err, data) {
	if (err) throw err;

	SightingList.setOmittedCommonNames(JSON.parse(data));
	logger.info('loaded omitted common names', Object.keys(SightingList.omittedCommonNames).length);
});

fs.readFile('server/data/ebird.csv', 'utf8', function(err, data) {
	if (err) throw err;

	var ebird = babyParse.parse(data, {
			header: true,
		});

	logger.info('parsed ebird', ebird.data.length);

	gSightingList = new SightingList();
	gSightingList.addRows(ebird.data);
	gSightingList.setGlobalIDs();

	gIndex = lunr(function () {
	    this.field('location');
	    this.field('common');
	    this.field('county');
	    this.field('trip');
	    this.field('scientific');
	    this.ref('id');
	});

	for (var index = 0; index < gSightingList.rows.length; index++) {
		var aValue = gSightingList.rows[index];

		if (aValue['State/Province']) {
			var tmp = iso3166.subdivision(aValue['State/Province']);
			if (tmp) {
				aValue['Country'] = tmp['countryName'];
			}
		}

		gIndex.add({
			location: aValue['Location'],
			county: aValue['County'],
			common: aValue['Common Name'],
			trip: SightingList.customDayNames[aValue['Date']],
			scientific: aValue['Scientific Name'],
			id: index,
		});
	}
});

// read and parse the full taxonomy list for eBird

var eBirdAllFilename = 'server/data/eBird_Taxonomy_v2016.csv';

fs.readFile(eBirdAllFilename, 'utf8', function(err, data) {
	if (err) throw err;

	var familyRanges = {};

	gEBirdAll = babyParse.parse(data, {
		header: true,
	});

	logger.info('parsed ebird all', gEBirdAll.data.length);

	for (var index = 0; index < gEBirdAll.data.length; index++) {
		var aValue = gEBirdAll.data[index];
		var aFamily = familyRanges[aValue['FAMILY']];
		var taxoValue = parseFloat(aValue['TAXON_ORDER']);

		if (aValue['FAMILY'] == '') {
			continue;
		}

		if (aFamily != null) {
			familyRanges[aValue['FAMILY']][0] = Math.min(taxoValue, aFamily[0]);
			familyRanges[aValue['FAMILY']][1] = Math.max(taxoValue, aFamily[1]);
		} else {
			familyRanges[aValue['FAMILY']] = [taxoValue, taxoValue];
		}
	}

	var familyKeys = Object.keys(familyRanges);

	for (index = 0; index < familyKeys.length; index++) {
		var aKey = familyKeys[index];
		var triple = [aKey, familyRanges[aKey][0], familyRanges[aKey][1]];
		SightingList.families.push(triple);
	}
});

// TODO: deal with taxo changes? try scientific name as well? deal with this at loading time?
function privateGetTaxoFromCommonName(inCommonName) {
	for (var index = 0; index < gEBirdAll.data.length; index++) {
		if (gEBirdAll.data[index]['PRIMARY_COM_NAME'] == inCommonName) {
			return parseFloat(gEBirdAll.data[index]['TAXON_ORDER']);
		}
	}

	return 'Unknown';
}

fs.readFile('server/data/photos.json', 'utf8', function(err, data) {
	if (err) throw err;
	gPhotos = JSON.parse(data);

	for (var index = 0; index < gPhotos.length; index++)
	{
		var photo = gPhotos[index];

		// // TODO: try to get the images
		// request(photo['Photo URL'], function(error, response, body) {
		// 	if (response == null) {
		// 		console.log('no response', error);
		// 	} else if (response.statusCode == 403) {
		// 		console.log('photo error', response.request.uri.href);
		// 	} else {
		// 		// console.log('thumbnail win');
		// 	}
		// });

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

	logger.info('parsed photos', gPhotos.length);
});

// ADD getWeek to Date class

Date.prototype.getWeek = function() {
    var dt = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - dt) / 86400000) + dt.getDay()+1)/7);
};

// REST API for ebird data

app.get('/photosThisWeek', function(req, resp, next) {
	var currentWeekOfYear = new Date().getWeek();
	var photosThisWeek = gPhotos.filter(function(p) { return p.DateObject.getWeek() == currentWeekOfYear; });	

	logger.debug('photos of the week', currentWeekOfYear, photosThisWeek.length);

	resp.json(photosThisWeek);
});

app.get('/photos', function(req, resp, next) {
	var currentWeekOfYear = new Date().getWeek();
	var photosThisWeek = gPhotos.filter(function(p) { return p.DateObject.getWeek() == currentWeekOfYear; });	

	logger.debug('photos of the week', currentWeekOfYear, photosThisWeek.length);

	var commonNamesByFamily = {};
	var photosByFamily = {};
	var photoCommonNamesByFamily = [];
	var speciesPhotographed = 0;

	// make an array of common name, taxonomic id, and family name

	for (var index = 0; index < gPhotos.length; index++) {
		var aPhoto = gPhotos[index];

		aPhoto.taxonomicSort = privateGetTaxoFromCommonName(aPhoto['Common Name']);
		aPhoto.family = SightingList.getFamily(aPhoto.taxonomicSort);
		photoCommonNamesByFamily.push({'Common Name': aPhoto['Common Name'], taxonomicSort: aPhoto.taxonomicSort, family: aPhoto.family});

		if (! photosByFamily[aPhoto.family]) {
			photosByFamily[aPhoto.family] = [];
		}

		photosByFamily[aPhoto.family].push(aPhoto);
	}

	// sort that array by taxonomic id

	photoCommonNamesByFamily.sort(function (x,y) { return x.taxonomicSort - y.taxonomicSort; } );

	// loop through that array and group into families

	for (index = 0; index < photoCommonNamesByFamily.length; index++) {
		aPhoto = photoCommonNamesByFamily[index];
		if (aPhoto.family == null) {
			console.log(aPhoto);
			continue;
		}

		if (! commonNamesByFamily[aPhoto.family ]) {
			commonNamesByFamily[aPhoto.family ] = [];
		}

		if (commonNamesByFamily[aPhoto.family].indexOf(aPhoto['Common Name']) < 0) {
			commonNamesByFamily[aPhoto.family].push(aPhoto['Common Name']);
			speciesPhotographed = speciesPhotographed + 1;
		}
	};

	logger.debug('/photos');

	// pass down to the page template all the photo data plus the list of common names in taxo order
	resp.send(gTemplates.photos({
		numPhotos: gPhotos.length,
		numSpecies: speciesPhotographed,
		photosByFamily: photosByFamily,
		hierarchy: commonNamesByFamily,
		photosThisWeek: photosThisWeek
	}));
});

app.get('/locations', function(req, resp, next) {
	logger.debug('/locations', gPhotos.length);

	resp.send(gTemplates.locations({
		count: gSightingList.getUniqueValues('Location').length,
		hierarchy: gSightingList.getLocationHierarchy(),
	}));
});


app.get('/bigdays', function(req, resp, next) {
	logger.debug('/bigdays');

	var speciesByDate = gSightingList.getSpeciesByDate();
	var bigDays = Object.keys(speciesByDate).map(function (key) { return [key, speciesByDate[key]]; });
	var bigDays = bigDays.filter(function (x) { return x[1].commonNames.length > 100; });
	bigDays = bigDays.map(function (x) { return { date: x[0], dateObject: x[1].dateObject, count: x[1].commonNames.length }; });
	bigDays.sort(function (x,y) { return y.count - x.count; } );

	// TODO: look up the custom day names for those days, don't just pass down the whole dang thing
	
	resp.send(gTemplates.bigdays({
		bigDays: bigDays,
		customDayNames: SightingList.customDayNames,
	}));
});

app.get('/family/:family_name', function(req, resp, next) {
	var tmp = gSightingList.filter(function(s) { return SightingList.getFamily(s['Taxonomic Order']) == req.params.family_name; });
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var photos = gPhotos.filter(function(p) { return SightingList.getFamily(privateGetTaxoFromCommonName(p['Common Name'])) == req.params.family_name; });

	var familySightingList = new SightingList(tmp, photos);

	logger.debug('/family/', req.params.family_name, familySightingList.rows.length);

	resp.send(gTemplates.family({

			name: req.params.family_name,
			chartID: 'bymonth' + Date.now(),
			showDates: familySightingList.dateObjects.length < 30,
			showLocations: familySightingList.getUniqueValues('Location').length < 30,
			sightingsByMonth: familySightingList.byMonth(),
			photos: familySightingList.getLatestPhotos(20),
			sightingList: familySightingList,
			taxons: familySightingList.commonNames,
			customDayNames: SightingList.customDayNames,
	}));
});

app.get('/taxons', function(req, resp, next) {
	let earliestByCommonName = gSightingList.getEarliestByCommonName();
	let lifeSightingsTaxonomic = Object.keys(earliestByCommonName).map(function(k){ return earliestByCommonName[k]; });
	lifeSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	let lifeSightingsList = new SightingList(lifeSightingsTaxonomic);

	logger.debug('/taxons');

	resp.send(gTemplates.taxons({
		lifeSightingsCount: lifeSightingsList.length(),
		hierarchy: lifeSightingsList.getTaxonomyHierarchy()
	}));
});

app.get('/chrono', function(req, resp, next) {
	var earliestByCommonName = gSightingList.getEarliestByCommonName();
	var lifeSightingsChronological = Object.keys(earliestByCommonName).map(function(k) { return earliestByCommonName[k]; });
	lifeSightingsChronological.sort(function(a, b) { return b['DateObject'] - a['DateObject']; });

	resp.send(gTemplates.chrono({firstSightings: lifeSightingsChronological}));
});

app.get('/taxon/:common_name', function(req, resp, next) {
	var tmp = gSightingList.filter(function(s) { return s['Common Name'] == req.params.common_name; });
	var photos = gPhotos.filter(function(p) { return p['Common Name'] == req.params.common_name; });

	var taxonSightingList = new SightingList(tmp, photos);
	taxonSightingList.sortByDate();

	logger.debug('/taxon/', req.params.common_name, taxonSightingList.rows.length);

	resp.send(gTemplates.taxon({

			name: req.params.common_name,
			showDates: taxonSightingList.length() < 30,
			scientificName: taxonSightingList.rows[0]['Scientific Name'],
			sightingsByMonth: taxonSightingList.byMonth(),
			photos: taxonSightingList.photos,
			sightingList: taxonSightingList,
			customDayNames: SightingList.customDayNames,
			chartID: 'bymonth' + Date.now(),

	}));
});

app.get('/trips', function(req, resp, next) {
	logger.debug('/trips');

	// TODO: feature envy; move this into sighting list?
	resp.send(gTemplates.trips({
		trips: gSightingList.dateObjects,
		customDayNames: SightingList.customDayNames,		
	}));
});

app.get('/search/:terms', function(req, resp, next) {
	var rawResults = gIndex.search(req.params.terms);

    var resultsAsSightings = rawResults.map(function (result) {
		return gSightingList.rows[result.ref];
    });

    var searchResultsSightingList = new SightingList(resultsAsSightings);

    logger.debug('/search/', resultsAsSightings.length, searchResultsSightingList.rows.length);

	resp.json({
		dates: searchResultsSightingList.dateObjects,
		customDayNames: SightingList.customDayNames,
		sightingList: searchResultsSightingList,
	});
});

app.get('/year/:year', function(req, resp, next) {
	var tmp = gSightingList.byYear()[req.params.year];
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var photos =  gPhotos.filter(function(p){ return p.Date.substring(6,10) == req.params.year; });
	var yearSightingList = new SightingList(tmp, photos);

	logger.debug('/year/', req.params.year, yearSightingList.rows.length);

	resp.send(gTemplates.year({
			year: req.params.year,
			photos: yearSightingList.getLatestPhotos(20),
			sightingList: yearSightingList,
		}));
});

app.get('/sighting/:sighting_id', function(req, resp, next) {
	logger.debug('/sighting/', req.params.sighting_id);
	resp.send(gTemplates.sighting(gSightingList.rows[req.params.sighting_id]));
});

app.get('/photo/:photo_id', function(req, resp, next) {
	logger.debug('/photo/', req.params.photo_id);
	resp.send(gTemplates.photo(gPhotos[req.params.photo_id]));
});

app.get('/trip/:trip_date', function(req, resp, next) {
	let tmp = gSightingList.filter(function(s) { return s['Date'] == req.params.trip_date; });
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	let photos = gPhotos.filter(function(p) { return p.Date == req.params.trip_date; });

	let tripSightingList = new SightingList(tmp, photos);

	logger.debug('/trip/', req.params.trip_date, tripSightingList.rows.length);

	resp.send(gTemplates.trip({

			tripDate: tripSightingList.rows[0].DateObject,
			photos: tripSightingList.photos,
			customName: tripSightingList.dayNames[0],
			submissionIDToSighting: tripSightingList.mapSubmissionIDToSighting(),
			comments: tripSightingList.getUniqueValues('Checklist Comments'),
			sightingList: tripSightingList,

	}));
});

// TODO: need location hierarchy

app.get('/place/:state_name', function(req, resp, next) {
	var tmp = gSightingList.filter(function(s) {
		return s['State/Province'] == req.params.state_name;
	});
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	var stateSightingList = new SightingList(tmp);
	// TODO: can't compute photos before creating list
	var stateLocations = stateSightingList.getUniqueValues('Location');
	stateSightingList.photos = gPhotos.filter(function(p) { return stateLocations.indexOf(p.Location) >= 0; });

	logger.debug('/state/', req.params.state_name, stateSightingList.length());

	resp.send(gTemplates.state({

			name: req.params.state_name,
			chartID: 'bymonth' + Date.now(),
			showDates: stateSightingList.getUniqueValues('Date').length < 30,
			sightingsByMonth: stateSightingList.byMonth(),
			photos: stateSightingList.getLatestPhotos(20),
			State: stateSightingList.rows[0]['State/Province'],
			Country: stateSightingList.rows[0]['Country'],
			sightingList: stateSightingList,
			taxons: stateSightingList.commonNames,
			customDayNames: SightingList.customDayNames,
			hierarchy: stateSightingList.getLocationHierarchy(),
	}));
});

app.get('/place/:state_name/:county_name', function(req, resp, next) {
	if (req.params.county_name == 'none') {
		req.params.county_name = '';
	}

	var tmp = gSightingList.filter(function(s) {
		return (s['State/Province'] == req.params.state_name) && (s['County'] == req.params.county_name);
	});
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	var countySightingList = new SightingList(tmp);
	// TODO: can't compute photos before creating list
	var countyLocations = countySightingList.getUniqueValues('Location');
	countySightingList.photos = gPhotos.filter(function(p) { return countyLocations.indexOf(p.Location) >= 0; });

	logger.debug('/county/', req.params.county_name, countySightingList.length());

	resp.send(gTemplates.county({

			name: req.params.county_name,
			chartID: 'bymonth' + Date.now(),
			showMap: true,
			showDates: countySightingList.getUniqueValues('Date').length < 30,
			sightingsByMonth: countySightingList.byMonth(),
			photos: countySightingList.getLatestPhotos(20),
			State: countySightingList.rows[0]['State/Province'],
			Region: countySightingList.rows[0]['Region'],
			Country: countySightingList.rows[0]['Country'],
			sightingList: countySightingList,
			taxons: countySightingList.commonNames,
			customDayNames: SightingList.customDayNames,

	}));
});

app.get('/place/:state_name/:county_name/:location_name', function(req, resp, next) {
	if (req.params.county_name == 'none') {
		req.params.county_name = '';
	}

	var tmp = gSightingList.filter(function(s) {
		return (s['State/Province'] == req.params.state_name) && (s['County'] == req.params.county_name) && (s['Location'] == req.params.location_name);
	});
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	// TODO: wrong, doesn't handle duplication location names
	var photos = gPhotos.filter(function(p) { return p.Location == req.params.location_name; });

	var locationSightingList = new SightingList(tmp, photos);

	logger.debug('/location/', req.params.state_name, req.params.county_name, req.params.location_name, locationSightingList.rows.length);

	resp.send(gTemplates.location({

			name: req.params.location_name,
			chartID: 'bymonth' + Date.now(),
			showChart: locationSightingList.dateObjects.length > 20,
			sightingsByMonth: locationSightingList.byMonth(),
			photos: locationSightingList.getLatestPhotos(20),
			sightingList: locationSightingList,
			customDayNames: SightingList.customDayNames,


	}));
});


app.get('/fixedphotos', function(req, resp, next) {
	for (var index = 0; index < gPhotos.length; index++)
	{
		var photo = gPhotos[index];
		delete photo.DateObject;
		delete photo.id;

		if (photo) {
			var tmp = gSightingList.filter(function (s) { return s.Location == photo.Location; });
			if (tmp[0] != null) {
				gPhotos[index].County = tmp[0].County;
				gPhotos[index]['State/Province'] = tmp[0]['State/Province'];
			} else {
				gPhotos[index].County = 'Unknown';
				gPhotos[index]['State/Province'] = 'Unknown';

				var candidateSightings = gSightingList.filter(function (s) {
					return ((s['Common Name'] == photo['Common Name']) && (s['Date'] == photo['Date']));
				})

				if (candidateSightings && candidateSightings[0]) {
					console.log('no location match', index, photo['Common Name'], photo.Location, 'try', candidateSightings[0].Location);
				} else {
					console.log('no location match', index, photo['Common Name'], photo.Location);
				}
			}
		} else {
			console.log('photo missing', index);
		}

	}

	resp.json(gPhotos);
});


