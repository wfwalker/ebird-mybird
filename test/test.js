// test.js
const assert = require('assert');
const fs = require('fs');
const winston = require('winston');
const babyParse = require('babyparse');
const SightingList = require('../server/scripts/sightinglist.js');
const registerHelpers = require('../server/scripts/helpers.js');
const createTemplates = require('../server/scripts/templates.js');
const Application = require('../server/scripts/application.js');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
		'timestamp': true,
		'level': 'debug'
      })
    ]
});

registerHelpers(logger);
gTemplates = createTemplates();

const testSightings = [
	{ Date: '01-01-2017', 'Common Name': 'Aaa' },
	{ Date: '01-02-2017', 'Common Name': 'Aaa' },
	{ Date: '01-03-2017', 'Common Name': 'Aaa' },
];

const testSightings2 = [
	{ Date: '01-04-2017', 'Common Name': 'Bbb' },
	{ Date: '01-05-2017', 'Common Name': 'Bbb' },
	{ Date: '01-06-2017', 'Common Name': 'Bbb' },
];

const testSightings3 = [
	{ Date: '01-07-2017', 'Common Name': 'Ccc' },
	{ Date: '01-08-2017', 'Common Name': 'Ccc' },
	{ Date: '01-09-2017', 'Common Name': 'Ccc' },
];

describe('SightingList', function() {
	describe('constructor', function() {
		it('constructs with no args', function() {
			let tmp = new SightingList();
			assert.ok(tmp);
		});

		it('constructs with empty array args', function() {
			let tmp = new SightingList([], []);
			assert.ok(tmp);
		});
	});

	describe('getEarliestByCommonName', function () {
		it('maps three sightings to single common name', function() {
			let tmp = new SightingList(testSightings);

			let earliestByCommonName = tmp.getEarliestByCommonName();
			assert.ok(earliestByCommonName['Aaa']);

			let keys = Object.keys(earliestByCommonName);
			assert.equal(keys.length, 1);
		});

		it('maps six sightings to two common names', function() {
			let tmp = new SightingList(testSightings.concat(testSightings2));

			let earliestByCommonName = tmp.getEarliestByCommonName();
			assert.ok(earliestByCommonName['Aaa']);
			assert.ok(earliestByCommonName['Bbb']);

			let keys = Object.keys(earliestByCommonName);
			assert.equal(keys.length, 2);
		});	

		it('supports chrono life list', function() {
			let tmp = new SightingList(testSightings3.concat(testSightings).concat(testSightings2));

			let earliestByCommonName = tmp.getEarliestByCommonName();
			let lifeSightingsChronological = Object.keys(earliestByCommonName).map(function(k) { return earliestByCommonName[k]; });
			lifeSightingsChronological.sort(function(a, b) { return b['DateObject'] - a['DateObject']; });
			assert.ok(lifeSightingsChronological[0].DateObject > lifeSightingsChronological[1].DateObject, 'first two in order');
			assert.ok(lifeSightingsChronological[1].DateObject > lifeSightingsChronological[2].DateObject, 'second two in order');
		});	
	});

	describe('with full data', function() {
		SightingList.loadDayNamesAndOmittedNames();
		SightingList.loadEBirdTaxonomy();

		var gSightingList = SightingList.newFromCSV('server/data/ebird.csv');
		var gPhotos = SightingList.newPhotosFromJSON('server/data/photos.json')
		let gApplication = new Application(gSightingList, gPhotos);
		registerHelpers(logger);
		const templates = createTemplates();

		it('getEarliestByCommonName in chrono order', function() {
			let earliestByCommonName = gSightingList.getEarliestByCommonName();
			let lifeSightingsChronological = Object.keys(earliestByCommonName).map(function(k) { return earliestByCommonName[k]; });
			lifeSightingsChronological.sort(function(a, b) { return b['DateObject'] - a['DateObject']; });
			assert.ok(lifeSightingsChronological[0].DateObject > lifeSightingsChronological[1].DateObject, 'first two in order');
			assert.ok(lifeSightingsChronological[1].DateObject > lifeSightingsChronological[2].DateObject, 'second two in order');
		});

		it ('renders sighting template', function() {
			assert.ok(templates.sighting(gSightingList.rows[0]).indexOf('undefined') < 0, 'rendered tempate should contain no undefined');
		});

		it ('renders trips template', function() {
			assert.ok(templates.trips(gApplication.dataForTripsTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined');
		});

		it ('renders photos template', function() {
			assert.ok(templates.photos(gApplication.dataForPhotosTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined');
		});

		it ('renders location template', function() {
			const req = {
				params: {
					state_name: 'US-CA',
					county_name: 'Santa Clara',
					location_name: 'Charleston Slough'
				}
			}
			assert.ok(templates.location(gApplication.dataForLocationTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined');
		});

		it ('renders state template', function() {
			const req = {
				params: {
					state_name: 'US-CA',
				}
			}
			assert.ok(templates.state(gApplication.dataForStateTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined');
		});
	});

	describe('loadDayNamesAndOmittedNames', function() {
		it('got some data', function() {
			assert.ok(Object.keys(SightingList.getCustomDayNames()).length > 0, 'should have some custom day names');
			assert.ok(SightingList.getOmittedCommonNames().length > 0, 'should have some omitted species common names');
		});
	})
});