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

var SightingList = function (inRowsFromCSV) {
	this.rows = inRowsFromCSV;
	this.rowsByYear = {};
	this.earliestRowByCommonName = {};
	this.earliestDateObject = null;
	this.latestDateObject = null;
	this.locations = this.getUniqueValues('Location');
	this.dates = this.getUniqueValues('Date');
	this.checklists = this.getUniqueValues('Submission ID');

	for (var index = 0; index < this.rows.length; index++) {
		var sighting = this.rows[index];

		if (sighting['Date']) {
			var pieces = sighting['Date'].split('-');
			var fixedDateString = [pieces[0], '/', pieces[1], '/', pieces[2]].join('');
			var newDate = new Date(fixedDateString);
			this.rows[index]['DateObject'] = newDate;

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

			// TODO: dependancy on external global and also race condition
			var omit = gOmittedCommonNames.indexOf(sighting['Common Name']) >=0;

			if (! omit) {
				if (! this.earliestRowByCommonName[sighting['Common Name']]) {
					this.earliestRowByCommonName[sighting['Common Name']] = sighting;
				} else if (sighting.DateObject < this.earliestRowByCommonName[sighting['Common Name']].DateObject) {
					this.earliestRowByCommonName[sighting['Common Name']] = sighting;
				}				
			}
		}
	}

	this.rows.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });	
}

SightingList.prototype.earliestDateObject = function() {
	return this.earliestDateObject;
}

SightingList.prototype.latestDateObject = function() {
	return this.latestDateObject;
}

SightingList.prototype.filter = function(filterFunc) {
	return this.rows.filter(filterFunc);
}

SightingList.prototype.count = function() {
	return this.rows.length;
}

SightingList.prototype.byYear = function() {
	return this.rowsByYear;
}

SightingList.prototype.earliestByCommonName = function() {
	return this.earliestRowByCommonName;
}	

SightingList.prototype.getUniqueValues = function(fieldName) {
	var values = [];

	for (var index = 1; index < this.rows.length; index++) {
		var aValue = this.rows[index][fieldName];
		if (values.indexOf(aValue) < 0) {
			values.push(aValue);
		}
	}

	return values;
};

if (typeof module != 'undefined') {
	module.exports = SightingList;
}
