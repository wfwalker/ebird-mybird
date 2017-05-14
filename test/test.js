// test.js
const assert = require('assert');
const SightingList = require('../server/scripts/sightinglist.js');

describe('ebird-mybird', function() {
	describe('hello world', function() {
		it('should always pass', function() {
			assert.equal(1, 1);
		});
	});
});

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
});