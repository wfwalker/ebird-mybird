// test.js

var assert = require('assert');

var SightingList = require ('../scripts/sightinglist.js');
var Papa = require ('../scripts/papaparse.js');

describe('Array', function() {
	describe('#indexOf()', function () {
		it('should return -1 when the value is not present', function () {
			assert.equal(-1, [1,2,3].indexOf(5));
			assert.equal(-1, [1,2,3].indexOf(0));
		});
	});
});

describe('SightingList', function() {
	describe('constructor', function () {
		it('should make empty list with empty argument', function () {
			var tmp = new SightingList();
			assert.equal(0, tmp.rows.length);
		});
	});
});
