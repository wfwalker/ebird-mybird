
function renderHome() {
	renderTemplate('home', 'Home', {
		numSightings: gSightings.count(),
		sightingsByYear: gSightings.byYear(),
		sightingsByMonth: gSightings.byMonth(),
		yearChartID: 'byYear' + Date.now(),
		monthChartID: 'byMonth' + Date.now(),
		numChecklists: gSightings.getUniqueValues('Submission ID').length,
		earliest: gSightings.earliestDateObject,
		latest: gSightings.latestDateObject,
		owner: 'Bill Walker',
	});
}

function renderLoading() {
	renderTemplate('loading', 'Loading', {
		owner: 'Bill Walker',
	});
}

function renderChrono() {
	var earliestByCommonName = gSightings.getEarliestByCommonName();
	var lifeSightingsChronological = Object.keys(earliestByCommonName).map(function(k) { return earliestByCommonName[k]; });
	lifeSightingsChronological.sort(function(a, b) { return b['DateObject'] - a['DateObject']; });

	renderTemplate('chrono', 'Life List', {
		firstSightings: lifeSightingsChronological,
	});
}

function renderTrips() {
	renderTemplate('trips', 'Trips', {
		trips: gSightings.dateObjects,
		customDayNames: gCustomDayNames,
	});
}

function renderBigDays() {
	var speciesByDate = gSightings.getSpeciesByDate();
	var bigDays = Object.keys(speciesByDate).map(function (key) { return [key, speciesByDate[key]]; });
	var bigDays = bigDays.filter(function (x) { return x[1].length > 100; });
	bigDays = bigDays.map(function (x) { return { date: x[0], count: x[1].length }; });
	bigDays.sort(function (x,y) { return y.count - x.count; } );

	renderTemplate('bigdays', 'Big Days', {
		bigDays: bigDays,
		customDayNames: gCustomDayNames,
	});
}

function renderTrip(inDate) {
	var tripSightings = gSightings.filter(function(s) { return s['Date'] == inDate; });
	var tripSightingList = new SightingList(tripSightings);

	renderTemplate('trip', inDate, {
		tripDate: tripSightings[0].DateObject,
		photos: gPhotos.filter(function(p){return p.Date == inDate;}),
		customName: gCustomDayNames[inDate],
		comments: tripSightingList.getUniqueValues('Checklist Comments'),
		sightingList: tripSightingList,
	});
}

function renderYear(inYear) {
	var yearSightings = gSightings.byYear()[inYear];
	yearSightings.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });
	var yearSightingList = new SightingList(yearSightings);

	renderTemplate('year', inYear, {
		year: inYear,
		photos: gPhotos.filter(function(p){return p.Date.substring(6,10) == inYear;}),
		yearSightings: yearSightings,
		yearSpecies: yearSightingList.getUniqueValues('Common Name'),
	});
}

function renderSighting(inID) {
	renderTemplate('sighting', gSightings.rows[inID]['Common Name'],
		gSightings.rows[inID]
	);
}

function renderPhoto(inID) {
	renderTemplate('photo', gPhotos[inID]['Common Name'],
		gPhotos[inID]
	);
}

function renderPhotos() {
	var photoCommonNames = [];

	for (var index = 0; index < gPhotos.length; index++) {
		var aValue = gPhotos[index]['Common Name'];
		if (photoCommonNames.indexOf(aValue) < 0) {
			photoCommonNames.push(aValue);
		}
	}

	photoCommonNames.sort();

	console.log(photoCommonNames);

	renderTemplate('photos', 'Photos', {
		photos: gPhotos,
		photoCommonNames: photoCommonNames,
	});
}

function renderLocations() {
	renderTemplate('locations', 'Locations', {
		hierarchy: gSightings.getLocationHierarchy(),
	});
}

function renderLocation(inLocationName) {
	var locationSightingsTaxonomic = gSightings.filter(function(s) { return s['Location'] == inLocationName; });
	locationSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	var locationSightingList = new SightingList(locationSightingsTaxonomic);

	renderTemplate('location', inLocationName, {
		name: inLocationName,
		chartID: 'bymonth' + Date.now(),
		showChart: locationSightingsTaxonomic.length > 100,
		sightingsByMonth: locationSightingList.byMonth(),
		photos: gPhotos.filter(function(p) { return p.Location == inLocationName; }),
		locationSightingsTaxonomic: locationSightingsTaxonomic,
		sightingList: locationSightingList,
		customDayNames: gCustomDayNames,
	});
}

function renderCounty(inCountyName) {
	var countySightingsTaxonomic = gSightings.filter(function(s) { return s['County'] == inCountyName; });
	countySightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	var countySightingList = new SightingList(countySightingsTaxonomic);
	var countyLocations = countySightingList.getUniqueValues('Location');


	renderTemplate('county', inCountyName + ' County', {
		name: inCountyName,
		chartID: 'bymonth' + Date.now(),
		sightingsByMonth: countySightingList.byMonth(),
		photos: gPhotos.filter(function(p) { return countyLocations.indexOf(p.Location) >= 0; }),
		state: countySightingsTaxonomic[0]['State/Province'],
		sightingList: countySightingList,
		countySightingsTaxonomic: countySightingsTaxonomic,
		taxons: countySightingList.commonNames,
		customDayNames: gCustomDayNames,
	});
}

function renderTaxons() {
	var earliestByCommonName = gSightings.getEarliestByCommonName();
	var lifeSightingsTaxonomic = Object.keys(earliestByCommonName).map(function(k){ return earliestByCommonName[k]; });
	lifeSightingsTaxonomic.sort(function(a, b) { return a['Taxonomic Order'] - b['Taxonomic Order']; });

	renderTemplate('taxons', 'Species', {
		lifeSightings: lifeSightingsTaxonomic,
	});
}

function renderTaxon(inCommonName) {
	var taxonSightings = gSightings.filter(function(s) { return s['Common Name'] == inCommonName; });
	taxonSightings.sort(function(a, b) { return a['DateObject'] - b['DateObject']; });

	var taxonSightingsList = new SightingList(taxonSightings);

	var scientificName = taxonSightings[0]['Scientific Name'];

	renderTemplate('taxon', inCommonName, {
		name: inCommonName,
		showChart: taxonSightings.length > 30,
		photos: gPhotos.filter(function(p){return p['Scientific Name'] == scientificName;}),
		scientificName: scientificName,
		sightingsByMonth: taxonSightingsList.byMonth(),
		sightings: taxonSightings,
		chartID: 'bymonth' + Date.now(),
	});
}

function renderDebug() {
	var tmp = gSightings.filter(function(s) { return s['Location'] && s['Location'].indexOf('/') >= 0; });
	var brokenLocationSightingList = new SightingList(tmp);
	var photosBadScientificName = [];
	var missingSightingsForCustomDayNames = {};
	var allLocations = gSightings.getUniqueValues('Location');

	for (var index = 0; index < gPhotos.length; index++) {
		var photo = gPhotos[index];
		var sightings = gSightings.filter(function (s) { return s['Scientific Name'] == photo['Scientific Name']; });
		if (sightings.length == 0) {
			console.log('no sightings for scientific name ' + photo['Scientific Name']);
			photosBadScientificName.push(photo);
		}
	}

	for (index in gCustomDayNames) {
		var aCustomDate = gCustomDayNames[index];
		var sightings = gSightings.filter(function (s) { return s['Date'] == index; });
		if (sightings.length == 0) {
			console.log('no sightings for', index, aCustomDate);
			missingSightingsForCustomDayNames[index] = aCustomDate;
		}
	}

	renderTemplate('debug', 'Debug', {
		photosMissingTrip: gPhotos.filter(function(p) { return gSightings.dates.indexOf(p.Date) < 0; }),
		photosMissingLocation: gPhotos.filter(function(p) { return allLocations.indexOf(p.Location) < 0; }),
		photosBadScientificName: photosBadScientificName,
		photos: gPhotos,
		brokenLocations: brokenLocationSightingList.locations,
		missingSightingsForCustomDayNames: missingSightingsForCustomDayNames,
	});
}

function renderSearchResults(inTerm) {
    var rawResults = gIndex.search(inTerm).map(function (result) {
		return gSightings.rows[result.ref];
    });

    var searchResultsSightingList = new SightingList(rawResults);

    console.log('search results', searchResultsSightingList);

	renderTemplate('searchresults', 'Search Results', {
		dates: searchResultsSightingList.dateObjects,
		customDayNames: gCustomDayNames,
		sightingList: searchResultsSightingList,
	});
}
