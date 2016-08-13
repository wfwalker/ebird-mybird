// server.js

var gSightingList = null;
var gPhotos = [];
var gEBirdAll = [];
var gIndex = null;

var express = require('express');
var compression = require('compression');
var expires = require('expires-middleware');
var lunr = require('lunr');
var iso3166 = require('iso-3166-2');
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

app.use(compression());
app.use(expires('24h'));

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
				aValue['Region'] = tmp['name'];
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

fs.readFile('app/data/eBird_all_v2015.csv', 'utf8', function(err, data) {
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

function privateGetTaxoFromCommonName(inCommonName) {
	for (var index = 0; index < gEBirdAll.data.length; index++) {
		if (gEBirdAll.data[index]['PRIMARY_COM_NAME'] == inCommonName) {
			return parseFloat(gEBirdAll.data[index]['TAXON_ORDER']);
		}
	}

	return 'Unknown';
}

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
	resp.json({numPhotos: gPhotos.length, numSpecies: speciesPhotographed, photosByFamily: photosByFamily, hierarchy: commonNamesByFamily});
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

app.get('/family/:family_name', function(req, resp, next) {
	var tmp = gSightingList.filter(function(s) { return SightingList.getFamily(s['Taxonomic Order']) == req.params.family_name; });
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var photos = gPhotos.filter(function(p) { return SightingList.getFamily(privateGetTaxoFromCommonName(p['Common Name'])) == req.params.family_name; });

	var familySightingList = new SightingList(tmp, photos);

	logger.debug('/family/', req.params.family_name, familySightingList.rows.length);

	resp.json(familySightingList);
});

app.get('/taxons', function(req, resp, next) {
	var earliestByCommonName = gSightingList.getEarliestByCommonName();
	var lifeSightingsTaxonomic = Object.keys(earliestByCommonName).map(function(k){ return earliestByCommonName[k]; });
	lifeSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var lifeSightingsList = new SightingList(lifeSightingsTaxonomic);

	logger.debug('/taxons');

	resp.json({
		lifeSightingsCount: lifeSightingsList.length(),
		hierarchy: lifeSightingsList.getTaxonomyHierarchy()
	});
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
	taxonSightingList.sortByDate();

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

	resp.json(stateSightingList);
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

	resp.json(countySightingList);
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

	resp.json(locationSightingList);
});


app.get('/fixedphotos', function(req, resp, next) {
	for (var index = 0; index < gPhotos.length; index++)
	{
		var photo = gPhotos[index];

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


