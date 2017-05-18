// server.js

var express = require('express')
var compression = require('compression')
var expires = require('expires-middleware')
var SightingList = require('../server/scripts/sightinglist.js')
var request = require('request')
var registerHelpers = require('../server/scripts/helpers.js')
var createTemplates = require('../server/scripts/templates.js')
var Application = require('../server/scripts/application.js')

require('../server/scripts/logger.js');

var gSightingList = SightingList.newFromCSV('server/data/ebird.csv');
var gPhotos = SightingList.newPhotosFromJSON('server/data/photos.json')
var gApplication = new Application(gSightingList, gPhotos);
var gIndex = gSightingList.createIndex();
SightingList.loadDayNamesAndOmittedNames();
SightingList.loadEBirdTaxonomy();

registerHelpers();

var gTemplates = createTemplates();

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


// REST API for ebird data

app.get('/', function(req, resp, next) {
	resp.redirect('/photos');
})

app.get('/photos', function(req, resp, next) {
	// pass down to the page template all the photo data plus the list of common names in taxo order
	resp.send(gTemplates.photos(gApplication.dataForPhotosTemplate()));
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

	let speciesByDate = gSightingList.getSpeciesByDate();
	let bigDays = Object.keys(speciesByDate).map(function (key) { return [key, speciesByDate[key]]; });
	bigDays = bigDays.filter(function (x) { return x[1].commonNames.length > 100; });
	bigDays = bigDays.map(function (x) { return { date: x[0], dateObject: x[1].dateObject, count: x[1].commonNames.length }; });
	bigDays.sort(function (x,y) { return y.count - x.count; } );

	// TODO: look up the custom day names for those days, don't just pass down the whole dang thing
	
	resp.send(gTemplates.bigdays({
		bigDays: bigDays,
		customDayNames: SightingList.getCustomDayNames(),
	}));
});

app.get('/family/:family_name', function(req, resp, next) {
	let tmp = gSightingList.filter(function(s) { return SightingList.getFamily(s['Taxonomic Order']) == req.params.family_name; });
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	let photos = gPhotos.filter(function(p) { return SightingList.getFamily(SightingList.getTaxoFromCommonName(p['Common Name'])) == req.params.family_name; });

	let familySightingList = new SightingList(tmp, photos);

	logger.debug('/family/', req.params.family_name, familySightingList.rows.length);

	resp.send(gTemplates.family({

			name: req.params.family_name,
			showDates: familySightingList.dateObjects.length < 30,
			showLocations: familySightingList.getUniqueValues('Location').length < 30,
			sightingsByMonth: familySightingList.byMonth(),
			photos: familySightingList.getLatestPhotos(20),
			sightingList: familySightingList,
			taxons: familySightingList.commonNames,
			customDayNames: SightingList.getCustomDayNames(),
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
	let earliestByCommonName = gSightingList.getEarliestByCommonName();
	let lifeSightingsChronological = Object.keys(earliestByCommonName).map(function(k) { return earliestByCommonName[k]; });
	lifeSightingsChronological.sort(function(a, b) { return b['DateObject'] - a['DateObject']; });

	resp.send(gTemplates.chrono({firstSightings: lifeSightingsChronological}));
});

app.get('/taxon/:common_name', function(req, resp, next) {
	let tmp = gSightingList.filter(function(s) { return s['Common Name'] == req.params.common_name; });
	let photos = gPhotos.filter(function(p) { return p['Common Name'] == req.params.common_name; });

	let taxonSightingList = new SightingList(tmp, photos);
	taxonSightingList.sortByDate();

	logger.debug('/taxon/', req.params.common_name, taxonSightingList.rows.length);

	resp.send(gTemplates.taxon({

			name: req.params.common_name,
			showDates: taxonSightingList.length() < 30,
			scientificName: taxonSightingList.rows[0]['Scientific Name'],
			sightingsByMonth: taxonSightingList.byMonth(),
			photos: taxonSightingList.photos,
			sightingList: taxonSightingList,
			customDayNames: SightingList.getCustomDayNames(),

	}));
});

app.get('/trips', function(req, resp, next) {
	logger.debug('/trips');

	// TODO: feature envy; move this into sighting list?
	resp.send(gTemplates.trips(gApplication.dataForTripsTemplate()));
});

app.get('/search', function(req, resp, next) {
	logger.debug('/search', req.query);
	let rawResults = gIndex.search(req.query.searchtext);

    let resultsAsSightings = rawResults.map(function (result) {
		return gSightingList.rows[result.ref];
    });

    let searchResultsSightingList = new SightingList(resultsAsSightings);

    logger.debug('/search/', resultsAsSightings.length, searchResultsSightingList.rows.length);

	resp.send(gTemplates.searchresults({
		dates: searchResultsSightingList.dateObjects,
		customDayNames: SightingList.getCustomDayNames(),
		sightingList: searchResultsSightingList,
	}));
});

app.get('/year/:year', function(req, resp, next) {
	let tmp = gSightingList.byYear()[req.params.year];
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	let photos =  gPhotos.filter(function(p){ return p.Date.substring(6,10) == req.params.year; });
	let yearSightingList = new SightingList(tmp, photos);

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
	logger.debug('/state/', req.params.state_name);
	resp.send(gTemplates.state(gApplication.dataForStateTemplate(req)));
});

app.get('/place/:state_name/:county_name', function(req, resp, next) {

	if (req.params.county_name == 'none') {
		req.params.county_name = '';
	}

	let tmp = gSightingList.filter(function(s) {
		return (s['State/Province'] == req.params.state_name) && (s['County'] == req.params.county_name);
	});
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; })

	let countySightingList = new SightingList(tmp)
	// TODO: can't compute photos before creating list
	let countyLocations = countySightingList.getUniqueValues('Location')
	countySightingList.photos = gPhotos.filter(function(p) { return countyLocations.indexOf(p.Location) >= 0; })

	logger.debug('/county/', req.params.county_name, countySightingList.length())

	resp.send(gTemplates.county({
			name: req.params.county_name,
			showDates: countySightingList.getUniqueValues('Date').length < 30,
			sightingsByMonth: countySightingList.byMonth(),
			photos: countySightingList.getLatestPhotos(20),
			State: countySightingList.rows[0]['State/Province'],
			Region: countySightingList.rows[0]['Region'],
			Country: countySightingList.rows[0]['Country'],
			sightingList: countySightingList,
			taxons: countySightingList.commonNames,
			customDayNames: SightingList.getCustomDayNames()
	}))
})

app.get('/place/:state_name/:county_name/:location_name', function(req, resp, next) {
	logger.debug ('LOCATION', req.params)
	resp.send(gTemplates.location(gApplication.dataForLocationTemplate(req)))
})
