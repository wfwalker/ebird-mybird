// test.js

var assert = require('assert');

var SightingList = require ('../scripts/sightinglist.js');
var Papa = require ('../scripts/papaparse.js');

var sampleRow = {
	"Submission ID":"S7756102",
	"Common Name":"Canada Goose",
	"Scientific Name":"Branta canadensis",
	"Taxonomic Order":"277",
	"Count":"X",
	"State/Province":"US-CA",
	"County":"Santa Clara",
	"Location":"Charleston Slough",
	"Latitude":"37.4347763",
	"Longitude":"-122.0990601",
	"Date":"02-10-1996",
	"Time":"",
	"Protocol":"eBird - Casual Observation",
	"Duration (Min)":"0",
	"All Obs Reported":"1",
	"DateObject":"1996-02-10T08:00:00.000Z"
};

// needed by SightingList constructor
gOmittedCommonNames = [];

describe('Array', function() {
	describe('#indexOf()', function () {
		it('should return -1 when the value is not present', function () {
			assert.equal(-1, [1,2,3].indexOf(5));
			assert.equal(-1, [1,2,3].indexOf(0));
		});
	});
});

describe('SightingList', function() {
	describe('empty constructor', function () {
		it('should make empty list with empty argument', function () {
			var tmp = new SightingList();
			assert.equal(0, tmp.rows.length);
		});
	});

	describe('single row constructor', function () {
		it('should construct an array of one row', function () {
			var tmp = new SightingList([sampleRow]);
			assert.equal(1, tmp.rows.length);
		});

		it('should calculate a list of one location name', function () {
			var tmp = new SightingList([sampleRow]);
			assert.equal("Charleston Slough", tmp.locations[0]);
		});
	});

});

