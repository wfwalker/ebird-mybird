// test.js
const assert = require('assert')
const SightingList = require('../server/scripts/sightinglist.js')
const registerHelpers = require('../server/scripts/helpers.js')
const createTemplates = require('../server/scripts/templates.js')
const Application = require('../server/scripts/application.js')

registerHelpers()

gTemplates = createTemplates()

const testSightings = [
  { Date: '01-01-2017', 'Common Name': 'Aaa' },
  { Date: '01-02-2017', 'Common Name': 'Aaa' },
  { Date: '01-03-2017', 'Common Name': 'Aaa' }
]

const testSightings2 = [
  { Date: '01-04-2017', 'Common Name': 'Bbb' },
  { Date: '01-05-2017', 'Common Name': 'Bbb' },
  { Date: '01-06-2017', 'Common Name': 'Bbb' }
]

const testSightings3 = [
  { Date: '01-07-2017', 'Common Name': 'Ccc' },
  { Date: '01-08-2017', 'Common Name': 'Ccc' },
  { Date: '01-09-2017', 'Common Name': 'Ccc' }
]

describe('SightingList', function () {
  describe('constructor', function () {
    it('constructs with no args', function () {
      let tmp = new SightingList()
      assert.ok(tmp)
    })

    it('constructs with empty array args', function () {
      let tmp = new SightingList([], [])
      assert.ok(tmp)
    })
  })

  describe('getEarliestByCommonName', function () {
    it('maps three sightings to single common name', function () {
      let tmp = new SightingList(testSightings)

      let earliestByCommonName = tmp.getEarliestByCommonName()
      assert.ok(earliestByCommonName['Aaa'])

      let keys = Object.keys(earliestByCommonName)
      assert.equal(keys.length, 1)
    })

    it('maps six sightings to two common names', function () {
      let tmp = new SightingList(testSightings.concat(testSightings2))

      let earliestByCommonName = tmp.getEarliestByCommonName()
      assert.ok(earliestByCommonName['Aaa'])
      assert.ok(earliestByCommonName['Bbb'])

      let keys = Object.keys(earliestByCommonName)
      assert.equal(keys.length, 2)
    })

    it('supports chrono life list', function () {
      let tmp = new SightingList(testSightings3.concat(testSightings).concat(testSightings2))

      let earliestByCommonName = tmp.getEarliestByCommonName()
      let lifeSightingsChronological = Object.keys(earliestByCommonName).map(function (k) { return earliestByCommonName[k] })
      lifeSightingsChronological.sort(function (a, b) { return b['DateObject'] - a['DateObject'] })
      assert.ok(lifeSightingsChronological[0].DateObject > lifeSightingsChronological[1].DateObject, 'first two in order')
      assert.ok(lifeSightingsChronological[1].DateObject > lifeSightingsChronological[2].DateObject, 'second two in order')
    })
  })

  describe('with full data', function () {
    let gApplication = Application.withFullData()

    // AFTER server is running, then create index
    gApplication.loadIndex('server/data/lunrIndex.json')

    registerHelpers(logger)
    const templates = createTemplates()

    it('getEarliestByCommonName in chrono order', function () {
      let earliestByCommonName = gApplication.allSightings.getEarliestByCommonName()
      let lifeSightingsChronological = Object.keys(earliestByCommonName).map(function (k) { return earliestByCommonName[k] })
      lifeSightingsChronological.sort(function (a, b) { return b['DateObject'] - a['DateObject'] })
      assert.ok(lifeSightingsChronological[0].DateObject > lifeSightingsChronological[1].DateObject, 'first two in order')
      assert.ok(lifeSightingsChronological[1].DateObject > lifeSightingsChronological[2].DateObject, 'second two in order')
    })

    it('renders sighting template', function () {
      assert.ok(templates.sighting(gApplication.allSightings.rows[0]).indexOf('undefined') < 0, 'rendered tempate should contain no undefined')
    })

    it('renders trips template', function () {
      assert.ok(templates.trips(gApplication.dataForTripsTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders trip template', function () {
      const req = {
        params: {
          trip_date: '03-10-2017'
        }
      }
      assert.ok(templates.trip(gApplication.dataForTripTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders year template', function () {
      const req = {
        params: {
          year: '2015'
        }
      }
      assert.ok(templates.year(gApplication.dataForYearTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders locations template', function () {
      assert.ok(templates.locations(gApplication.dataForLocationsTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders photos template', function () {
      assert.ok(templates.photos(gApplication.dataForPhotosTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders bigdays template', function () {
      assert.ok(templates.bigdays(gApplication.dataForBigdaysTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders taxons template', function () {
      assert.ok(templates.taxons(gApplication.dataForTaxonsTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders chrono template', function () {
      assert.ok(templates.chrono(gApplication.dataForChronoTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders family template', function () {
      const req = {
        params: {
          family_name: 'Apodidae (Swifts)'
        }
      }
      assert.ok(templates.family(gApplication.dataForFamilyTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders sighting template', function () {
      const req = {
        params: {
          sighting_id: '29'
        }
      }
      assert.ok(templates.sighting(gApplication.dataForSightingTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders photo template', function () {
      const req = {
        params: {
          photo_id: '29'
        }
      }
      assert.ok(templates.photo(gApplication.dataForPhotoTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders location template', function () {
      const req = {
        params: {
          state_name: 'US-CA',
          county_name: 'Santa Clara',
          location_name: 'Charleston Slough'
        }
      }
      assert.ok(templates.location(gApplication.dataForLocationTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders county template', function () {
      const req = {
        params: {
          state_name: 'US-CA',
          county_name: 'Santa Clara'
        }
      }
      assert.ok(templates.county(gApplication.dataForCountyTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders state template', function () {
      const req = {
        params: {
          state_name: 'US-CA'
        }
      }
      assert.ok(templates.state(gApplication.dataForStateTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('renders search template for sandpiper', function () {
      const req = {
        query: {
          searchtext: 'sandpiper'
        }
      }
      assert.ok(templates.searchresults(gApplication.dataForSearchTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    })

    it('finds matches when searching for sandpiper', function () {
      const req = {
        query: {
          searchtext: 'sandpiper'
        }
      }
      let searchResults = gApplication.dataForSearchTemplate(req)
      assert.ok(searchResults.sightingList.length() > 0, 'should find some sightings')
    })

    it('finds matches when searching for least', function () {
      const req = {
        query: {
          searchtext: 'least'
        }
      }
      let searchResults = gApplication.dataForSearchTemplate(req)
      assert.ok(searchResults.sightingList.length() > 0, 'should find some sightings')
    })
  })

  describe('loadDayNamesAndOmittedNames', function () {
    it('got some data', function () {
      assert.ok(Object.keys(SightingList.getCustomDayNames()).length > 0, 'should have some custom day names')
      assert.ok(SightingList.getOmittedCommonNames().length > 0, 'should have some omitted species common names')
    })
  })
})
