// given a representation of CSV data with fieldnames in the first row,
// return an array of unique values for the column with the given name

gSightings = null;

function getUniqueValues(data, fieldName) {
	var values = [];

	for (var index = 1; index < data.length; index++) {
		var aValue = data[index][fieldName];
		if (values.indexOf(aValue) < 0) {
			values.push(aValue);
		}
	}

	return values;
};

function getSpeciesForDate(data, inDate) {
	var datePosition = data[0].indexOf('Date');
	var speciesPosition = data[0].indexOf('Scientific Name');

	var values = [];
	var date2 = new Date(inDate);

	for (var index = 1; index < data.length; index++) {
		var row = data[index];

		var date1 = new Date(row[datePosition]);

		if (date1.toDateString() == date2.toDateString()) {
			values.push(row[speciesPosition]);
		}
	}

	return values;	
};

function getLocationsForDate(data, inDate) {
	var datePosition = data[0].indexOf('Date');
	var locationPosition = data[0].indexOf('Location');

	var values = [];
	var date2 = new Date(inDate);

	for (var index = 1; index < data.length; index++) {
		var row = data[index];

		var date1 = new Date(row[datePosition]);

		if (date1.toDateString() == date2.toDateString()) {
			var aValue = row[locationPosition];
			if (values.indexOf(aValue) < 0) {
				values.push(aValue);
			}
		}
	}

	return values;	
};

// returns a promise to parse the eBird CSV data

function parseEBirdData() {
	var deferred = Q.defer();

	var parser = csv.parse({delimiter: ','}, function(err, data){
		deferred.resolve(data);
		// getUniqueValues(data, 'Location');
		// getUniqueValues(data, 'Common Name');
		// getUniqueValues(data, 'County');
	});

	var inputStream = fs.createReadStream(__dirname + '/ebird.csv');

	inputStream.pipe(parser);

	return deferred.promise;
};

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


var eBirdData = null;

function addSummaryItem(inString) {
	var p = document.createElement("p");
	p.innerHTML = inString;
	document.getElementById('results').appendChild(p);
}

document.addEventListener("DOMContentLoaded", function(event) { 
	console.log('hi mom');

	Papa.parse("./data/ebird.csv", {
		download: true,
		header: true,
		complete: function(results) {
			gSightings = results.data;

			console.log('moo', results.data[0]);
			gScientificNames = getUniqueValues(gSightings, 'Scientific Name');
			gCommonNames = getUniqueValues(gSightings, 'Common Name');
			gLocations = getUniqueValues(gSightings, 'Location');
			gDates = getUniqueValues(gSightings, 'Date');

			addSummaryItem('scientific names ' + gScientificNames.length);
			addSummaryItem('common names ' + gCommonNames.length);
			addSummaryItem('locations ' + gLocations.length);
			addSummaryItem('dates ' + gDates.length);

			addSummaryItem('sample sighting ' + JSON.stringify(gSightings[0]));
		}
	});  

	console.log('end');	
});
