// server.js

var express = require('express');
var babyParse = require('babyparse');
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

fs.readFile('app/data/ebird.csv', 'utf8', function(err, data) {
	if (err) throw err;
	var ebird = babyParse.parse(data, {
			header: true,
		});
	console.log('parsed', ebird.data.length);
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

app.get('/locationSightingsTaxonomic/:location_name', function(req, resp, next) {
	var locationSightingsTaxonomic = gSightings.filter(function(s) { return s['Location'] == req.params.location_name; });
	locationSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	console.log('location sightings', req.params.location_name, locationSightingsTaxonomic.length);

	resp.json(locationSightingsTaxonomic);
});


app.get('/countySightingsTaxonomic/:county_name', function(req, resp, next) {
	var countySightingsTaxonomic = gSightings.filter(function(s) { return s['County'] == req.params.county_name; });
	countySightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	console.log('county sightings', req.params.county_name, countySightingsTaxonomic.length);

	resp.json(countySightingsTaxonomic);
});