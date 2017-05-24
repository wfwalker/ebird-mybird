// server.js

var express = require('express')
var compression = require('compression')
var expires = require('expires-middleware')
var registerHelpers = require('../server/scripts/helpers.js')
var createTemplates = require('../server/scripts/templates.js')
var Application = require('../server/scripts/application.js')

require('../server/scripts/logger.js')

var gApplication = Application.withFullData()

registerHelpers()

var gTemplates = createTemplates()

var myPort = process.env.PORT || 8091

var app = express()

app.use(compression())
app.use(expires('24h'))

app.listen(myPort)

// static styles folder
app.use('/styles', express.static('server/styles'))
app.use('/scripts', express.static('server/scripts'))
app.use('/images', express.static('server/images'))

// REST API for ebird data

app.get('/', function (req, resp, next) {
  resp.redirect('/photos')
})

app.get('/photos', function (req, resp, next) {
  logger.debug('/photos')
  resp.send(gTemplates.photos(gApplication.dataForPhotosTemplate()))
})

app.get('/locations', function (req, resp, next) {
  logger.debug('/locations')
  resp.send(gTemplates.locations(gApplication.dataForLocationsTemplate()))
})

app.get('/bigdays', function (req, resp, next) {
  logger.debug('/bigdays')
  resp.send(gTemplates.bigdays(gApplication.dataForBigdaysTemplate()))
})

app.get('/family/:family_name', function (req, resp, next) {
  logger.debug('/family/', req.params.family_name)
  resp.send(gTemplates.family(gApplication.dataForFamilyTemplate(req)))
})

app.get('/taxons', function (req, resp, next) {
  logger.debug('/taxons')
  resp.send(gTemplates.taxons(gApplication.dataForTaxonsTemplate()))
})

app.get('/chrono', function (req, resp, next) {
  resp.send(gTemplates.chrono(gApplication.dataForChronoTemplate()))
})

app.get('/taxon/:common_name', function (req, resp, next) {
  logger.debug('/taxon/', req.params.common_name)
  resp.send(gTemplates.taxon(gApplication.dataForTaxonTemplate(req)))
})

app.get('/trips', function (req, resp, next) {
  logger.debug('/trips')
  resp.send(gTemplates.trips(gApplication.dataForTripsTemplate()))
})

app.get('/search', function (req, resp, next) {
  logger.debug('/search/', req.param.searchtext)
  resp.send(gTemplates.searchresults(gApplication.dataForSearchTemplate(req)))
})

app.get('/year/:year', function (req, resp, next) {
  logger.debug('/year/', req.params.year)
  resp.send(gTemplates.year(gApplication.dataForYearTemplate(req)))
})

app.get('/sighting/:sighting_id', function (req, resp, next) {
  logger.debug('/sighting/', req.params.sighting_id)
  resp.send(gTemplates.sighting(gApplication.dataForSightingTemplate(req)))
})

app.get('/photo/:photo_id', function (req, resp, next) {
  logger.debug('/photo/', req.params.photo_id)
  resp.send(gTemplates.photo(gApplication.dataForPhotoTemplate(req)))
})

app.get('/trip/:trip_date', function (req, resp, next) {
  logger.debug('/trip/', req.params.trip_date)
  resp.send(gTemplates.trip(gApplication.dataForTripTemplate(req)))
})

// TODO: need location hierarchy

app.get('/place/:state_name', function (req, resp, next) {
  logger.debug('/state/', req.params.state_name)
  resp.send(gTemplates.state(gApplication.dataForStateTemplate(req)))
})

app.get('/place/:state_name/:county_name', function (req, resp, next) {
  logger.debug('/county/')
  resp.send(gTemplates.county(gApplication.dataForCountyTemplate(req)))
})

app.get('/place/:state_name/:county_name/:location_name', function (req, resp, next) {
  logger.debug('LOCATION', req.params)
  resp.send(gTemplates.location(gApplication.dataForLocationTemplate(req)))
})

// AFTER server is running, then create index
gApplication.loadIndex('server/data/lunrIndex.json')
