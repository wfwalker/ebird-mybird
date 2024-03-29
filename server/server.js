// server.js

var express = require('express')
var compression = require('compression')
var expires = require('expires-middleware')
var Application = require('../server/scripts/application.js')

require('../server/scripts/logger.js')

var gApplication = Application.withFullData()

var myPort = process.env.PORT || 8091

var app = express()

app.use(compression())
app.use(expires('24h'))

app.listen(myPort)

// static styles folder
app.use('/styles', express.static('server/styles'))
app.use('/scripts', express.static('server/scripts'))
app.use('/images', express.static('server/images'))

const options = { beautify: false }

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine(options));

app.get('/', function (req, resp, next) {
  resp.redirect('/photos')
})

app.get('/photos', function (req, resp, next) {
  logger.debug('/photos')
  resp.render('photos', gApplication.dataForPhotosTemplate())
})

app.get('/videos', function (req, resp, next) {
  logger.debug('/videos')
  resp.render('videos', gApplication.dataForPhotosTemplate())
})

app.get('/shop', function (req, resp, next) {
  logger.debug('/shop')
  resp.redirect('https://www.etsy.com/shop/BirdWalkerShop')
})
app.get('/store', function (req, resp, next) {
  logger.debug('/store')
  resp.redirect('https://www.etsy.com/shop/BirdWalkerShop')
})
app.get('/postcards', function (req, resp, next) {
  logger.debug('/postcards')
  resp.redirect('https://www.etsy.com/shop/BirdWalkerShop')
})

app.get('/photos/dayofyear/:dayofyear', function (req, resp, next) {
  logger.debug('/photos/dayofyear/' + req.params.dayofyear)
  resp.render('photosdayofyear', gApplication.dataForPhotosDayOfYearTemplate(req))
})

app.get('/locations', function (req, resp, next) {
  logger.debug('/locations')
  resp.render('locations', gApplication.dataForLocationsTemplate())
})

app.get('/locations/vr', function (req, resp, next) {
  logger.debug('/locations/vr')
  resp.render('locationsvr', gApplication.dataForLocationsTemplate())
})

app.get('/bigdays', function (req, resp, next) {
  logger.debug('/bigdays')
  resp.render('bigdays', gApplication.dataForBigdaysTemplate())
})

app.get('/family/:family_name', function (req, resp, next) {
  logger.debug('/family/', req.params.family_name)
  resp.render('family', gApplication.dataForFamilyTemplate(req))
})

app.get('/taxons', function (req, resp, next) {
  logger.debug('/taxons')
  resp.render('taxons', gApplication.dataForTaxonsTemplate())
})

app.get('/chrono', function (req, resp, next) {
  resp.render('chrono', gApplication.dataForChronoTemplate())
})

app.get('/taxon/:common_name', function (req, resp, next) {
  logger.debug('/taxon/', req.params.common_name)
  resp.render('taxon', gApplication.dataForTaxonTemplate(req))
})

app.get('/trips', function (req, resp, next) {
  logger.debug('/trips')
  resp.render('trips', gApplication.dataForTripsTemplate())
})

app.get('/search', function (req, resp, next) {
  logger.debug('/search/', req.query.searchtext)
  let commonNames = gApplication.allSightings.getUniqueValues('Common Name')

  if (commonNames.includes(req.query.searchtext)) {
    logger.error('redirect to taxon')
    resp.redirect('/taxon/' + encodeURIComponent(req.query.searchtext))
  } else {
    logger.error('JUST DO SEARCH')
    resp.render('searchresults', gApplication.dataForSearchTemplate(req))
  }
})

app.get('/searchdata', function (req, resp, next) {
  logger.debug('/searchdata/', req.param.searchtext)
  const searchResults = gApplication.dataForSearchTemplate(req)
  const matches = searchResults.sightingList.getUniqueValues('Common Name').concat(
    searchResults.sightingList.getUniqueValues('Location'))
  resp.json(matches)
})

app.get('/sighting/:sighting_id', function (req, resp, next) {
  logger.debug('/sighting/', req.params.sighting_id)
  resp.render('sighting', gApplication.dataForSightingTemplate(req))
})

app.get('/photo/:photo_id', function (req, resp, next) {
  logger.debug('/photo/', req.params.photo_id)
  resp.render('photo', gApplication.dataForPhotoTemplate(req))
})

// Time Hierarchy

app.get('/time/:year', function (req, resp, next) {
  logger.debug('/year/', req.params.year)
  resp.render('year', gApplication.dataForYearTemplate(req))
})

app.get('/time/:year/:month', function (req, resp, next) {
  logger.debug('/month/', req.params.year, '/', req.params.month)
  resp.render('month', gApplication.dataForYearAndMonthTemplate(req))
})

app.get('/trip/:trip_date', function (req, resp, next) {
  logger.debug('/trip/', req.params.trip_date)
  resp.render('trip', gApplication.dataForTripTemplate(req))
})

// location hierarchy

app.get('/place/:state_name', function (req, resp, next) {
  logger.debug('/state/', req.params.state_name)
  resp.render('state', gApplication.dataForStateTemplate(req))
})

app.get('/place/:state_name/:county_name', function (req, resp, next) {
  logger.debug('/county/')
  resp.render('county', gApplication.dataForCountyTemplate(req))
})

app.get('/place/:state_name/:county_name/:location_name', function (req, resp, next) {
  logger.debug('LOCATION', req.params)
  resp.render('location', gApplication.dataForLocationTemplate(req))
})
