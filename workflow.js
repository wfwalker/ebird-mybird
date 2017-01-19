console.log('hello, world');

var iptc = require('node-iptc');
var fs = require('fs');
var xml2js = require('xml2js');
var babyParse = require('babyparse');
var SightingList = require('./app/scripts/sightinglist.js');

var gFiles = {};
var gSightingList = null;

fs.readFile('server/data/ebird.csv', 'utf8', function(err, data) {
	if (err) throw err;

	var ebird = babyParse.parse(data, {
			header: true,
		});

	console.log('parsed ebird', ebird.data.length);

	gSightingList = new SightingList();
	gSightingList.addRows(ebird.data);
	gSightingList.setGlobalIDs();

	// read all the recent JPEG's in flickrUp
	var allTheFiles = fs.readdirSync('/Users/walker/Photography/flickrUp');
	var theNow = new Date();

	var jpegs = allTheFiles.filter((n) => {
		var stats = fs.statSync('/Users/walker/Photography/flickrUp/' + n);
		var daysOld = (theNow - stats.birthtime)/(24*60*60*1000);
		return (daysOld < 60);
	});

	var creationDates = jpegs.map((n) => {
		let tmpFile = fs.readFileSync('/Users/walker/Photography/flickrUp/' + n);
		let tmpIPTCdate = iptc(tmpFile).date_created;
		let tmpDate = tmpIPTCdate.substring(0,4) + '-' + tmpIPTCdate.substring(4,6) + '-' + tmpIPTCdate.substring(6,8);
		let tmpEbirdDate = tmpIPTCdate.substring(4,6) + '-' + tmpIPTCdate.substring(6,8) + '-' + tmpIPTCdate.substring(0,4);
		let tmpPath = tmpIPTCdate.substring(0,4) + '/' + tmpDate + '/' + n.replace('jpg', 'xmp');

		gFiles[n] = { date: tmpIPTCdate };

		if (fs.existsSync('/Volumes/Big\ Ethel/Photos/' + tmpPath)) {
			// PARSE XML

			var parser = new xml2js.Parser();
			fs.readFile('/Volumes/Big\ Ethel/Photos/' + tmpPath, function(err, data) {
			    parser.parseString(data, function (err, result) {
			        let label = result['x:xmpmeta']['rdf:RDF'][0]['rdf:Description'][0]['$']['xmp:Label'];
			        let location = result['x:xmpmeta']['rdf:RDF'][0]['rdf:Description'][0]['$']['Iptc4xmpCore:Location'];
					let daySightingList = new SightingList(gSightingList.filter(function(s) { return s['Date'] == tmpEbirdDate; }));
					let speciesSightings = daySightingList.filter(s => { return s['Common Name'] == label });

			        gFiles[n].label = label;
			        gFiles[n].location = location;
			        gFiles[n].date = tmpDate;
			        gFiles[n].ebirdDate = tmpEbirdDate;
			        gFiles[n].sightingsThatDate = daySightingList.length();
			        gFiles[n].speciesSightingsThatDate = speciesSightings;
			        gFiles[n].locations = daySightingList.getUniqueValues('Location');

			        if (speciesSightings.length > 0) {
				       	console.log(n, speciesSightings[0].id, location);
			        } else if (daySightingList.length() > 0) {
			        	console.log(n, 'trip yes but', label, 'no', tmpEbirdDate);
			        } else {
			        	console.log(n, 'no trip this date', tmpEbirdDate);
			        }
			    });
			});
		}

		return { name: n, path: tmpPath };
	});
});

// for each image do:
//      find the XMP file (find the digitize date, use that and the list of roots to look)
//      find a trip ID, find a species ID, find a location ID
//      make site JPEG's
//      create JSON for photos.json
//      upload photos to S3