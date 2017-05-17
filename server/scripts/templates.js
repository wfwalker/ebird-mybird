var fs = require('fs');
var Handlebars = require('handlebars');

function createTemplates() {
	return {
		photo: Handlebars.compile(fs.readFileSync('server/templates/photo.html', 'UTF-8')),
		trips: Handlebars.compile(fs.readFileSync('server/templates/trips.html', 'UTF-8')),
		trip: Handlebars.compile(fs.readFileSync('server/templates/trip.html', 'UTF-8')),
		sighting: Handlebars.compile(fs.readFileSync('server/templates/sighting.html', 'UTF-8')),
		taxon: Handlebars.compile(fs.readFileSync('server/templates/taxon.html', 'UTF-8')),
		taxons: Handlebars.compile(fs.readFileSync('server/templates/taxons.html', 'UTF-8')),
		family: Handlebars.compile(fs.readFileSync('server/templates/family.html', 'UTF-8')),
		location: Handlebars.compile(fs.readFileSync('server/templates/location.html', 'UTF-8')),
		photos: Handlebars.compile(fs.readFileSync('server/templates/photos.html', 'UTF-8')),
		county: Handlebars.compile(fs.readFileSync('server/templates/county.html', 'UTF-8')),
		state: Handlebars.compile(fs.readFileSync('server/templates/state.html', 'UTF-8')),
		locations: Handlebars.compile(fs.readFileSync('server/templates/locations.html', 'UTF-8')),
		bigdays: Handlebars.compile(fs.readFileSync('server/templates/bigdays.html', 'UTF-8')),
		chrono: Handlebars.compile(fs.readFileSync('server/templates/chrono.html', 'UTF-8')),
		year: Handlebars.compile(fs.readFileSync('server/templates/year.html', 'UTF-8')),
		searchresults: Handlebars.compile(fs.readFileSync('server/templates/searchresults.html', 'UTF-8')),
	};
}

Handlebars.registerPartial('head', fs.readFileSync('server/templates/head.html', 'UTF-8'));
Handlebars.registerPartial('foot', fs.readFileSync('server/templates/foot.html', 'UTF-8'));

if (typeof module != 'undefined') {
	module.exports = createTemplates;
}
