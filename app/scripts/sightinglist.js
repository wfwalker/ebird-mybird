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


var SightingList = function (inRows, inPhotos) {
	this.rows = [];
	this._uniqueValuesCache = {};
	this.rowsByYear = {};
	this.rowsByMonth = { '01': [], '02': [], '03': [], '04': [], '05': [], '06': [], '07': [], '08': [], '09': [], '10': [], '11': [], '12': [] };
	this._speciesByDate = {};
	this._earliestRowByCommonName = null;
	this.earliestDateObject = null;
	this.latestDateObject = null;
	this.dates = [];
	this.dateObjects = [];
	this.dayNames = [];
	this.photos = inPhotos;


	if (inRows) {
		if (inRows instanceof Array) {
			this.addRows(inRows);
		} else {
			throw new Error('not an array');
		}
	}
};

SightingList.omittedCommonNames = [];
SightingList.customDayNames = [];

SightingList.setCustomDayNames = function(inNames) {
	SightingList.customDayNames = inNames;
};

SightingList.setOmittedCommonNames = function(inNames) {
	SightingList.omittedCommonNames = inNames;
};

SightingList.families = [];

function convertDate(inDate) {
	var tmp = new Date(inDate);
	tmp.setTime( tmp.getTime() + tmp.getTimezoneOffset()*60*1000 );
	return tmp;
}

SightingList.prototype.initialize = function(inData) {
	this.rows = inData.rows;
	this._uniqueValuesCache = inData._uniqueValuesCache;
	this.rowsByYear = inData.rowsByYear;
	this.rowsByMonth = inData.rowsByMonth;
	this._speciesByDate = inData.speciesByDate;
	this._earliestRowByCommonName = inData._earliestRowByCommonName;
	this.earliestDateObject = convertDate(inData.earliestDateObject);
	this.latestDateObject = convertDate(inData.latestDateObject);
	this.dates = inData.dates;
	this.dateObjects = inData.dateObjects;
	this.dayNames = inData.dayNames;
	this.photos = inData.photos;

	// fix the dates
	for (var index = 0; index < this.dateObjects.length; index++) {
		this.dateObjects[index] = convertDate(this.dateObjects[index]);
	}

	for (index = 0; index < this.rows.length; index++) {
		this.rows[index].DateObject = convertDate(this.rows[index].DateObject);
	}
};

SightingList.prototype.setGlobalIDs = function() {
	for (var index = 0; index < this.rows.length; index++) {
		var sighting = this.rows[index];
		sighting.id = index;
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
			var newDate = convertDate(fixedDateString);
			sighting['DateObject'] = newDate;

			if (this.dates.indexOf(sighting['Date']) < 0) {
				this.dates.push(sighting['Date']);
				this.dateObjects.push(newDate);
				this.dayNames.push(SightingList.customDayNames[sighting['Date']]);
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
};

SightingList.prototype.sortByDate = function() {
	// TODO: this is probably unnecessary sort!
	this.rows.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });           
}

SightingList.prototype.sortByLocation = function() {
	this.rows.sort(function(a, b) {
		if (a['State/Province'] < b['State/Province']) {
			return -1;
		} else if (a['State/Province'] > b['State/Province']) {
			return 1;
		} else {
			if (a['County'] < b['County']) {
				return -1;
			} else if (a['County'] > b['County']) {
				return 1;
			} else {
				if (a['Location'] < b['Location']) {
					return -1;
				} else if (a['Location'] > b['Location']) {
					return 1;
				} else {
					return 0;
				}
			}
		}
	});
}

SightingList.prototype.earliestDateObject = function() {
	return this.earliestDateObject;
};

SightingList.prototype.latestDateObject = function() {
	return this.latestDateObject;
};

SightingList.prototype.filter = function(filterFunc) {
	return this.rows.filter(filterFunc);
};

SightingList.prototype.length = function() {
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

SightingList.prototype.getLocationHierarchy = function() {
	this.sortByLocation();

	var provinces = {};

	for (var index = 0; index < this.rows.length; index++) {
		var aSighting = this.rows[index];

		var province = aSighting['State/Province'];
		var county = aSighting['County'];
		var location = aSighting['Location'];

		if (! provinces[province]) {
			provinces[province] = {};
		}

		if (! provinces[province][county]) {
			provinces[province][county] = [];
		}

		if (provinces[province][county].indexOf(location) < 0) {
			provinces[province][county].push(location);
		}
	}

	return provinces;
};

SightingList.getFamily = function(inTaxonomicOrderID) {
	for (var index = 0; index < SightingList.families.length; index++) {
		var tmp = SightingList.families[index];
		if ((tmp[1] <= inTaxonomicOrderID) && (inTaxonomicOrderID <= tmp[2])) {
			return tmp[0];
		}
	}

	return null;
}

SightingList.prototype.getTaxonomyHierarchy = function() {
	var byFamily = {};

	console.log(byFamily);

	for (var index = 0; index < this.rows.length; index++) {
		var aSighting = this.rows[index];
		var commonName = aSighting['Common Name'];
		if (aSighting['Taxonomic Order']) {
			var taxoID = parseFloat(aSighting['Taxonomic Order']);
			var aFamily = SightingList.getFamily(taxoID);

			if (aFamily == null) {
				console.log(taxoID, commonName);
				continue;
			}

			if (! byFamily[aFamily]) {
				byFamily[aFamily] = [];
			}

			if (byFamily[aFamily].indexOf(commonName) < 0) {
				byFamily[aFamily].push(commonName);
			}
		} else {
			console.log('no scientific name', aSighting);
		}
	}

	return byFamily;
};

SightingList.prototype.mapLocationToSubmissionID = function() {
	var tmpMap = {};

	for (var index = 0; index < this.rows.length; index++) {
		var sighting = this.rows[index];
		var location = sighting['Location'];

		if (! tmpMap[location]) {
			tmpMap[location] = sighting['Submission ID'];
		}
	}

	return tmpMap;
}

SightingList.prototype.mapSubmissionIDToChecklistComments = function() {
	var tmpMap = {};

	for (var index = 0; index < this.rows.length; index++) {
		var sighting = this.rows[index];
		var submissionID = sighting['Submission ID'];

		if (! tmpMap[submissionID]) {
			tmpMap[submissionID] = sighting['Checklist Comments'];
		}
	}

	return tmpMap;
}
SightingList.prototype.mapSubmissionIDToLocation = function() {
	var tmpMap = {};

	for (var index = 0; index < this.rows.length; index++) {
		var sighting = this.rows[index];
		var submissionID = sighting['Submission ID'];

		if (! tmpMap[submissionID]) {
			tmpMap[submissionID] = [sighting['State/Province'], sighting['County'], sighting['Location']];
		}
	}

	return tmpMap;
}

SightingList.prototype.getSpeciesByDate = function() {
	console.log('computing speciesByDate');
	
	for (var index = 0; index < this.rows.length; index++) {
		var sighting = this.rows[index];

		if (! this._speciesByDate[sighting['Date']]) {
			this._speciesByDate[sighting['Date']] = {
				commonNames: [],
				dateObject: sighting['DateObject'],
			};
		}
		if (this._speciesByDate[sighting['Date']].commonNames.indexOf(sighting['Common Name']) < 0) {
			this._speciesByDate[sighting['Date']].commonNames.push(sighting['Common Name']);
		}
	};

	return this._speciesByDate;
};

SightingList.prototype.getEarliestByCommonName = function() {
	console.log('computing earliestByCommonName');

	this._earliestRowByCommonName = {};

	for (var index = 0; index < this.rows.length; index++) {
		var sighting = this.rows[index];

		if (SightingList.omittedCommonNames.indexOf(sighting['Common Name']) < 0) {
			if (! this._earliestRowByCommonName[sighting['Common Name']]) {
				this._earliestRowByCommonName[sighting['Common Name']] = sighting;
			} else if (sighting.DateObject < this._earliestRowByCommonName[sighting['Common Name']].DateObject) {
				this._earliestRowByCommonName[sighting['Common Name']] = sighting;
			}	
		} else {
			// console.log('omit', sighting['Common Name']);
		}
	};

	return this._earliestRowByCommonName;
};

// Return as many as possible recent photos from the list, up to the supplied limit
SightingList.prototype.getLatestPhotos = function(inPhotoCount) {
	if (this.photos.length <= inPhotoCount) {
		// if the limit exceeds the available photos, return all of them.
		return this.photos;
	} else {
		// sort the photos into date order and return up to the supplied limit
		// NOTE: assumes you have read the photos and added DatObject field to them.
		// see server.js code for reading photos.json
		this.photos.sort(function(a, b) {
			return a.DateObject < b.DateObject;
		});

		return this.photos.slice(0, inPhotoCount);
	}
}


if (typeof module != 'undefined') {
	module.exports = SightingList;
}
