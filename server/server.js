// server.js

var gSightingList = null;
var gPhotos = [];
var gIndex = null;

var express = require('express');
var lunr = require('lunr');
var babyParse = require('babyparse');
var SightingList = require('../app/scripts/sightinglist.js');
var fs = require('fs');
var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
		'timestamp': true,
		'level': 'debug'
      })
    ]
});

var myPort = process.env.PORT || 8090;
var mHost = process.env.VCAP_APP_HOST || "127.0.0.1";

var app = express();

app.listen(myPort);

// serve up the dist directory as the root so we get the client
app.use("/", express.static('dist'));


// parse the ebird data so we can make a REST API for it

fs.readFile('app/data/day-names.json', 'utf8', function(err, data) {
	if (err) throw err;

	SightingList.setCustomDayNames(JSON.parse(data));
	logger.info('loaded custom day names', Object.keys(SightingList.customDayNames).length);
});

fs.readFile('app/data/omitted-common-names.json', 'utf8', function(err, data) {
	if (err) throw err;

	SightingList.setOmittedCommonNames(JSON.parse(data));
	logger.info('loaded omitted common names', Object.keys(SightingList.omittedCommonNames).length);
});

fs.readFile('app/data/ebird.csv', 'utf8', function(err, data) {
	if (err) throw err;

	var ebird = babyParse.parse(data, {
			header: true,
		});

	logger.info('parsed ebird', ebird.data.length);

	gSightingList = new SightingList();
	gSightingList.addRows(ebird.data);

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

fs.readFile('app/data/photos.json', 'utf8', function(err, data) {
	if (err) throw err;
	gPhotos = JSON.parse(data);

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

	logger.debug('photos of the week', photosThisWeek.length);

	resp.json(photosThisWeek);
});

app.get('/photos', function(req, resp, next) {
	logger.debug('/photos', gPhotos.length);

	var photoCommonNames = {};
	var earliestByCommonName = gSightingList.getEarliestByCommonName();

	for (var index = 0; index < gPhotos.length; index++) {
		var aValue = gPhotos[index]['Common Name'];
		if (! photoCommonNames[aValue]) {
			if (earliestByCommonName[aValue]) {
				photoCommonNames[aValue] = earliestByCommonName[aValue]['Taxonomic Order'];
			} else {
				logger.error('cant find taxo order', aValue);
			}
		}
	}

	var pairs = Object.keys(photoCommonNames).map(function(key) { return [key, photoCommonNames[key]]; });
	pairs.sort(function (x, y) { return x[1] - y[1]; });

	resp.json({photos: gPhotos, photoCommonNames: pairs.map(function (x) { return x[0]; })});
});

app.get('/locations', function(req, resp, next) {
	logger.debug('/locations', gPhotos.length);

	resp.json({
		count: gSightingList.getUniqueValues('Location').length,
		hierarchy: gSightingList.getLocationHierarchy(),
	});
});


app.get('/bigdays', function(req, resp, next) {
	logger.debug('/bigdays');

	var speciesByDate = gSightingList.getSpeciesByDate();
	var bigDays = Object.keys(speciesByDate).map(function (key) { return [key, speciesByDate[key]]; });
	var bigDays = bigDays.filter(function (x) { return x[1].commonNames.length > 100; });
	bigDays = bigDays.map(function (x) { return { date: x[0], dateObject: x[1].dateObject, count: x[1].commonNames.length }; });
	bigDays.sort(function (x,y) { return y.count - x.count; } );

	// TODO: look up the custom day names for those days, don't just pass down the whole dang thing
	
	resp.json({
		bigDays: bigDays,
		customDayNames: SightingList.customDayNames,
	});
});

app.get('/location/:location_name', function(req, resp, next) {
	var tmp = gSightingList.filter(function(s) { return s['Location'] == req.params.location_name; });
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var photos = gPhotos.filter(function(p) { return p.Location == req.params.location_name; });

	var locationSightingList = new SightingList(tmp, photos);

	logger.debug('/location/', req.params.location_name, locationSightingList.rows.length);

	resp.json(locationSightingList);
});

app.get('/taxons', function(req, resp, next) {
	var earliestByCommonName = gSightingList.getEarliestByCommonName();
	var lifeSightingsTaxonomic = Object.keys(earliestByCommonName).map(function(k){ return earliestByCommonName[k]; });
	lifeSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var lifeSightingsList = new SightingList(lifeSightingsTaxonomic);

	logger.debug('/taxons');

	resp.json({ hierarchy: lifeSightingsList.getTaxonomyHierarchy() });
});

app.get('/chrono', function(req, resp, next) {
	var earliestByCommonName = gSightingList.getEarliestByCommonName();
	var lifeSightingsChronological = Object.keys(earliestByCommonName).map(function(k) { return earliestByCommonName[k]; });
	lifeSightingsChronological.sort(function(a, b) { return b['DateObject'] - a['DateObject']; });

	resp.json({firstSightings: lifeSightingsChronological});
});

app.get('/taxon/:common_name', function(req, resp, next) {
	var tmp = gSightingList.filter(function(s) { return s['Common Name'] == req.params.common_name; });
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var photos = gPhotos.filter(function(p) { return p['Common Name'] == req.params.common_name; });

	var taxonSightingList = new SightingList(tmp, photos);

	logger.debug('/taxon/', req.params.common_name, taxonSightingList.rows.length);

	resp.json(taxonSightingList);
});

app.get('/trips', function(req, resp, next) {
	logger.debug('/trips');

	// TODO: feature envy; move this into sighting list?
	resp.json({
		trips: gSightingList.dateObjects,
		customDayNames: SightingList.customDayNames,		
	});
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

	resp.json(yearSightingList);
});

app.get('/sighting/:sighting_id', function(req, resp, next) {
	logger.debug('/sighting/', req.params.sighting_id);
	resp.json(gSightingList.rows[req.params.sighting_id]);
});

app.get('/photo/:photo_id', function(req, resp, next) {
	logger.debug('/photo/', req.params.photo_id);
	resp.json(gPhotos[req.params.photo_id]);
});

app.get('/trip/:trip_date', function(req, resp, next) {
	var tmp = gSightingList.filter(function(s) { return s['Date'] == req.params.trip_date; });
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var photos = gPhotos.filter(function(p) { return p.Date == req.params.trip_date; });

	var tripSightingList = new SightingList(tmp, photos);

	logger.debug('/trip/', req.params.trip_date, tripSightingList.rows.length);

	resp.json(tripSightingList);
});

app.get('/county/:county_name', function(req, resp, next) {
	var tmp = gSightingList.filter(function(s) { return s['County'] == req.params.county_name; });
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	var countySightingList = new SightingList(tmp);
	// TODO: can't compute photos before creating list
	var countyLocations = countySightingList.getUniqueValues('Location');
	countySightingList.photos = gPhotos.filter(function(p) { return countyLocations.indexOf(p.Location) >= 0; });


	logger.debug('/county/', req.params.county_name, countySightingList.length());

	resp.json(countySightingList);
});