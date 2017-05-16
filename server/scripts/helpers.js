var Handlebars = require('handlebars');
var moment = require('moment');
var { URL, URLSearchParams } = require('url');
var iso3166 = require('iso-3166-2');

function registerHelpers(logger) {
	Handlebars.registerHelper('nicedate', function(inDate) {
		if (inDate) {
			return new Handlebars.SafeString (
				moment(inDate).format('MMM D, Y')
			);
		} else {
			return new Handlebars.SafeString ('NaN');
		}
	});

	Handlebars.registerHelper('values', function(inList, inPropertyName) {
		return inList.getUniqueValues(inPropertyName);
	});

	Handlebars.registerHelper('locations', function(inList) {
		let triples = [];
		let tmp = [];

		for (let index = 0; index < inList.rows.length; index++) {
			let row = inList.rows[index];
			let triple = [row['State/Province'], row['County'], row['Location']];
			let code = triple.join('-');

			if (tmp.indexOf(code) == -1) {
				triples.push(triple);
				tmp.push(code);
			}
		}

		return triples;
	});

	Handlebars.registerHelper('lookupState', function(inString) {
		logger.debug('lookupState', inString);
		if (inString == null || inString == '') {
			return 'None';
		} else if (! iso3166.subdivision(inString).name) {
			return inString;
		} else {
			return iso3166.subdivision(inString).name;
		}
	});

	Handlebars.registerHelper('addnone', function(inString) {
		if (inString == '') {
			return 'none';
		} else {
			return inString;
		}
	});

	Handlebars.registerHelper('random', function(inDictionary, inKey) {
		let tmp = inDictionary[inKey].length;
		return inDictionary[inKey][Math.trunc(Math.random() * tmp)];
	});

	Handlebars.registerHelper('stripLatinFromEbirdFamily', function(inString) {
		return inString.replace(/.*\((.*)\)/, '$1');
	});

	Handlebars.registerHelper('valuecount', function(inList, inPropertyName) {
		return inList.getUniqueValues(inPropertyName).length;
	});

	Handlebars.registerHelper('multiplevalues', function(inList, inPropertyName) {
		return inList.getUniqueValues(inPropertyName).length > 1;
	});

	Handlebars.registerHelper('isnumber', function(inValue) {
		return !isNaN(inValue);
	});

	Handlebars.registerHelper('ebirddate', function(inDate) {
		return new Handlebars.SafeString (
			moment(inDate).format('MM-DD-Y')
		);
	});

	Handlebars.registerHelper('sortabledate', function(inDate) {
		return new Handlebars.SafeString (
			moment(inDate).format('Y-MM-DD')
		);
	});

	Handlebars.registerHelper('spacetodash', function(inString) {
		return new Handlebars.SafeString (
			inString.toLowerCase().replace(' ', '-')
		);
	});

	Handlebars.registerHelper('spacetounder', function(inString) {
		return new Handlebars.SafeString (
			inString.replace(' ', '_')
		);
	});

	Handlebars.registerHelper('encode', function(inString) {
		return encodeURIComponent(inString);
	});

	Handlebars.registerPartial('thumbnails',
		'<div class="mygallery"> \
		{{#each photos}} \
		  <a href="/photo/{{id}}"><img alt="{{[Common Name]}}" src="{{[Photo URL]}}"></a> \
		{{/each}} \
		</div>'
	);

	Handlebars.registerPartial('specieslist',
		'<div class="biglist"> \
		{{#each (values sightingList "Common Name")}} \
		  <div class="biglist-item"> \
		    <a href="/taxon/{{encode this}}">{{this}}</a> \
		  </div> \
		{{/each}} \
		</div>'
	);

	Handlebars.registerHelper('nicenumber', function(inNumber) {
		return new Handlebars.SafeString (
			inNumber
		);
	});

	Handlebars.registerHelper('googlemap', function(inData, inElement) {
		let mapsURL = new URL('https://maps.googleapis.com/maps/api/staticmap');
		mapsURL.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY);
		mapsURL.searchParams.append('size', '640x360');
		let markers = inData.rows.map(row => row.Latitude + ',' + row.Longitude);
		let markerSet = new Set(markers);
		let markersNoDups = Array.from(markerSet);
		logger.debug('markers', markers.length, 'markersNoDups', markersNoDups.length);
		mapsURL.searchParams.append('markers', markersNoDups.join('|'));

		return new Handlebars.SafeString('<img src="' + mapsURL.toString() + '">');
	});

	Handlebars.registerHelper('monthgraph', function(inData, inElement) {
		// per @digitarald use timeout to reorder helper after Handlebars templating
		// byMonthForSightings(inData, '#' + inElement);

		let chartURL = new URL('https://chart.googleapis.com/chart');
		chartURL.searchParams.append('chxt', 'x,y');
		chartURL.searchParams.append('cht', 'bvs');
		let counts = inData.map(d => d.length);
		let axisRange = [0, 0, 12, 12];
		chartURL.searchParams.append('chd', 't:' + counts.join(','));
		chartURL.searchParams.append('chxr', axisRange.join(','));
		chartURL.searchParams.append('chco', '76A4FB');
		chartURL.searchParams.append('chls', '2.0');
		chartURL.searchParams.append('chs', '360x200');

		logger.debug(chartURL);	

		return new Handlebars.SafeString('<img src="' + chartURL.toString() + '">');
	});
}

if (typeof module != 'undefined') {
	module.exports = registerHelpers;
}
