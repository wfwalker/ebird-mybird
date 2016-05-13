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

fs.readFile('app/data/ebird.csv', 'utf8', function(err, data) {
	if (err) throw err;
	var ebird = babyParse.parse(data, {
			header: true,
		});
	console.log('parsed', ebird.data.length);
	gSightings = ebird.data;
});

// REST API for ebird data

app.get('/locationSightingsTaxonomic/:location_name', function(req, resp, next) {
	var locationSightingsTaxonomic = gSightings.filter(function(s) { return s['Location'] == req.params.location_name; });
	locationSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	console.log('name', req.params.location_name, locationSightingsTaxonomic.length);

	resp.json(locationSightingsTaxonomic);
});