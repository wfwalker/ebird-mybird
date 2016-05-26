// server.js

var express = require('express');
var babyParse = require('babyparse');
var SightingList = require('../app/scripts/sightinglist.js');
var fs = require('fs');

var myPort = process.env.PORT || 8090;
var mHost = process.env.VCAP_APP_HOST || "127.0.0.1";

var app = express();

app.listen(myPort);

// serve up the dist directory as the root so we get the client
app.use("/", express.static('dist'));


// parse the ebird data so we can make a REST API for it

var gSightings = [];
var gPhotos = [];
var gOmittedCommonNames = [];
var gCustomDayNames = [];
var gPhotos = [];
var gIndex = null;

fs.readFile('app/data/day-names.json', 'utf8', function(err, data) {
	if (err) throw err;

	gCustomDayNames = JSON.parse(data);
	console.log('loaded custom day names', Object.keys(gCustomDayNames).length);
});

fs.readFile('app/data/omitted-common-names.json', 'utf8', function(err, data) {
	if (err) throw err;

	gOmittedCommonNames = JSON.parse(data);
	console.log('loaded ommitted common names', Object.keys(gOmittedCommonNames).length);
});

fs.readFile('app/data/ebird.csv', 'utf8', function(err, data) {
	if (err) throw err;
	var ebird = babyParse.parse(data, {
			header: true,
		});
	console.log('parsed ebird', ebird.data.length);
	gSightings = ebird.data;
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

	console.log('parsed photos', gPhotos.length);
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

	console.log('photos of the week', photosThisWeek.length);

	resp.json(photosThisWeek);
});

app.get('/location/:location_name', function(req, resp, next) {
	var tmp = gSightings.filter(function(s) { return s['Location'] == req.params.location_name; });
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var photos = gPhotos.filter(function(p) { return p.Location == req.params.location_name; });

	var locationSightingList = new SightingList(tmp, photos);

	console.log('location sightings', req.params.location_name, locationSightingList.rows.length);

	resp.json(locationSightingList);
});


app.get('/county/:county_name', function(req, resp, next) {
	var tmp = gSightings.filter(function(s) { return s['County'] == req.params.county_name; });
	tmp.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	var countySightingList = new SightingList(tmp);
	// TODO: can't compute photos before creating list
	var countyLocations = countySightingList.getUniqueValues('Location');
	countySightingList.photos = gPhotos.filter(function(p) { return countyLocations.indexOf(p.Location) >= 0; });


	console.log('county sightings', req.params.county_name, countySightingList.length());

	resp.json(countySightingList);
});