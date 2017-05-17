'use strict';

const SightingList = require('./sightinglist.js');

class Application {
	constructor(inAllSightings) {
		this.allSightings = inAllSightings;
	}

	dataForTripsTemplate() {
		return {
			trips: this.allSightings.dateObjects,
			customDayNames: SightingList.getCustomDayNames(),
		}
	}
}

if (typeof module != 'undefined') {
	module.exports = Application;
}
