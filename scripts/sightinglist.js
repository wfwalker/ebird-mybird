'use strict';

// Submission ID, S7755084
// Common Name, Black-bellied Whistling-Duck
// Scientific Name, Dendrocygna autumnalis
// Taxonomic Order, 215
// Count, X
// State/Province, US-TX
// County, Cameron
// Location, Brownsville
// Latitude, 25.911388
// Longitude, -97.4904876
// Date, 04-17-2004
// Time,
// Protocol, eBird - Casual Observation
// Duration (Min),
// All Obs Reported,
// Distance Traveled (km),
// Area Covered (ha),
// Number of Observers,
// Breeding Code,
// Species Comments,
// Checklist Comments

var SightingList = function (inRows) {
	this.rows = [];
	this._uniqueValuesCache = {};
	this.rowsByYear = {};
	this.rowsByMonth = { '01': [], '02': [], '03': [], '04': [], '05': [], '06': [], '07': [], '08': [], '09': [], '10': [], '11': [], '12': [] };
	this._speciesByDate = {};
	this._earliestRowByCommonName = {};
	this.earliestDateObject = null;
	this.latestDateObject = null;
	this.dates = [];
	this.dateObjects = [];


	if (inRows) {
		if (inRows instanceof Array) {
			this.addRows(inRows);
		} else {
			throw new Error('not an array');
		}
	}
};

SightingList.prototype.addRows = function(inRows) {
	for (var index = 0; index < inRows.length; index++) {
		var sighting = inRows[index];

		if (sighting['Date']) {
			// Parse the date
			var pieces = sighting['Date'].split('-');

			// order the pieces in a sensible way
			var fixedDateString = [pieces[0], '/', pieces[1], '/', pieces[2]].join('');

			// create and save the new dat
			var newDate = new Date(fixedDateString);
			sighting['DateObject'] = newDate;

			if (this.dates.indexOf(sighting['Date']) < 0) {
				this.dates.push(sighting['Date']);
				this.dateObjects.push(newDate);
			}

			if (this.earliestDateObject == null || newDate < this.earliestDateObject) {
				this.earliestDateObject = newDate;
			}

			if (this.latestDateObject == null || newDate > this.latestDateObject) {
				this.latestDateObject = newDate;
			}

			if (! this.rowsByYear[pieces[2]]) {
				this.rowsByYear[pieces[2]] = [];
			}
			this.rowsByYear[pieces[2]].push(sighting);

			if (! this.rowsByMonth[pieces[0]]) {
				this.rowsByMonth[pieces[0]] = [];
			}
			this.rowsByMonth[pieces[0]].push(sighting);

		} else {
			console.log('ERROR SIGHTING HAS NO DATE', index, JSON.stringify(sighting));
		}
	}

	this.rows = this.rows.concat(inRows);

	this.dateObjects.sort(function(a, b) { return b - a; });

	// TODO: this is probably unnecessary sort!
	this.rows.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });		
};

SightingList.prototype.earliestDateObject = function() {
	return this.earliestDateObject;
};

SightingList.prototype.latestDateObject = function() {
	return this.latestDateObject;
};

SightingList.prototype.filter = function(filterFunc) {
	return this.rows.filter(filterFunc);
};

SightingList.prototype.count = function() {
	return this.rows.length;
};

SightingList.prototype.byYear = function() {
	return this.rowsByYear;
};

SightingList.prototype.byMonth = function() {
	return [
		this.rowsByMonth['01'],
		this.rowsByMonth['02'],
		this.rowsByMonth['03'],
		this.rowsByMonth['04'],
		this.rowsByMonth['05'],
		this.rowsByMonth['06'],
		this.rowsByMonth['07'],
		this.rowsByMonth['08'],
		this.rowsByMonth['09'],
		this.rowsByMonth['10'],
		this.rowsByMonth['11'],
		this.rowsByMonth['12'],
	];
};

SightingList.prototype.addToIndex = function(inIndex) {
	for (var index = 0; index < this.rows.length; index++) {
		var aValue = this.rows[index];
		var searchString = [aValue['Common Name'], aValue['Scientific Name'], aValue['Location']].join(' ');

		inIndex.add({
			body: searchString,
			kind: 'species',
			id: index,
		});
	}
};

SightingList.prototype.getUniqueValues = function(fieldName) {
	if (this._uniqueValuesCache[fieldName]) {
		console.log('returning cached unique values for', fieldName);
	} else {
		console.log('computing unique values for', fieldName);
		var tmpValues = [];
		for (var index = 0; index < this.rows.length; index++) {
			var aValue = this.rows[index][fieldName];
			if (tmpValues.indexOf(aValue) < 0) {
				tmpValues.push(aValue);
			}
		}
		this._uniqueValuesCache[fieldName] = tmpValues;
	}

	return this._uniqueValuesCache[fieldName];
};

SightingList.prototype.getSpeciesByDate = function() {
	console.log('computing speciesByDate');
	
	for (var index = 0; index < this.rows.length; index++) {
		var sighting = this.rows[index];

		if (! this._speciesByDate[sighting['Date']]) {
			this._speciesByDate[sighting['Date']] = [];
		}
		if (this._speciesByDate[sighting['Date']].indexOf(sighting['Common Name']) < 0) {
			this._speciesByDate[sighting['Date']].push(sighting['Common Name']);
		}
	};

	return this._speciesByDate;
};

SightingList.prototype.getEarliestByCommonName = function() {
	console.log('computing earliestByCommonName');
	
	for (var index = 0; index < this.rows.length; index++) {
		var sighting = this.rows[index];

		if (gOmittedCommonNames.indexOf(sighting['Common Name']) < 0) {
			if (! this._earliestRowByCommonName[sighting['Common Name']]) {
				this._earliestRowByCommonName[sighting['Common Name']] = sighting;
			} else if (sighting.DateObject < this._earliestRowByCommonName[sighting['Common Name']].DateObject) {
				this._earliestRowByCommonName[sighting['Common Name']] = sighting;
			}	
		} else {
			console.log('omit', sighting['Common Name']);
		}
	};

	return this._earliestRowByCommonName;
};


if (typeof module != 'undefined') {
	module.exports = SightingList;
}