// test.js
const assert = require('assert')
const SightingList = require('../server/scripts/sightinglist.js')
const Application = require('../server/scripts/application.js')
const reactRender = require('express-react-views').createEngine()

const reactViewOptions = {
  settings: {
    env: 'development',
    views: '../server/views'
  }
};

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

  describe('getEarliestSightings', function () {
    it('supports chrono life list', function () {
      let tmp = new SightingList(testSightings3.concat(testSightings).concat(testSightings2))

      let lifeSightingsChronological = tmp.getEarliestSightings()
      lifeSightingsChronological.sort(function (a, b) { return b['DateObject'] - a['DateObject'] })
      assert.ok(lifeSightingsChronological[0].DateObject > lifeSightingsChronological[1].DateObject, 'first two in order')
      assert.ok(lifeSightingsChronological[1].DateObject > lifeSightingsChronological[2].DateObject, 'second two in order')
    })
  })

  describe('with full data', function () {
    let gApplication = Application.withFullData()

    it('excludes omitted names from chronological life list', function () {
      let chronoData = gApplication.dataForChronoTemplate()
      assert.equal(chronoData.firstSightingList.filter(fs => (fs['Common Name'] == 'swallow sp.')).length, 0, 'it should not have "swallow sp."')
      assert.equal(chronoData.firstSightingList.filter(fs => (fs['Common Name'] == 'sparrow sp.')).length, 0, 'it should not have "sparrow sp."')
    })

    it('has valid location names for all photos', function () {
      let locationNames = gApplication.allSightings.getUniqueValues('Location')
      let missingLocationPhotos = gApplication.allPhotos.filter((p) => (locationNames.indexOf(p.Location) < 0))
      let bogusLocationNames = missingLocationPhotos.map(p => p.Location)
      assert.ok(bogusLocationNames.length == 0, 'photos has bogus location names ' + bogusLocationNames)
    })

    it('has no early photos for birds with recent photos', function () {
      let byCommonName = {}
      let sadCommonNames = []

      for (let index = 0; index < gApplication.allPhotos.length; index++) {
        let photo = gApplication.allPhotos[index]
        if (! byCommonName[photo['Common Name']]) {
          byCommonName[photo['Common Name']] = []
        }
        byCommonName[photo['Common Name']].push(photo.DateObject.getFullYear())
      }

      let commonNames = Object.keys(byCommonName)
      for (index = 0; index < commonNames.length; index++) {
        let sorted = byCommonName[commonNames[index]].sort()
        let yearRange = sorted[sorted.length - 1] - sorted[0]
        if (yearRange > 5) {
          sadCommonNames.push(commonNames[index])
        }
      }

      assert.ok(sadCommonNames.length == 0, 'no early photos for birds with recent photos ' + sadCommonNames)
    })

// TODO: add test asserting that latin name in photos.json matches latin name in ebird.cvs and taxonomy

    it('has valid species common names for all photos', function () {
      let bogusCommonNames = []
      for (let index = 0; index < gApplication.allPhotos.length; index++) {
        let photo = gApplication.allPhotos[index]
        if (SightingList.getCategoryFromCommonName(photo['Common Name']) == 'Unknown') {
          bogusCommonNames.push(photo['Common Name'])
        }
      }
      assert.ok(bogusCommonNames.length == 0, 'photos has no taxon category for these common names ' + bogusCommonNames)   
    })

    it('has matching scientific names for all photos', function () {
      let bogusCommonNames = []
      for (let index = 0; index < gApplication.allPhotos.length; index++) {
        let photo = gApplication.allPhotos[index]
        if (SightingList.getScientificFromCommonName(photo['Common Name']) != photo['Scientific Name']) {
          bogusCommonNames.push(photo['Common Name'])
        }
      }
      assert.ok(bogusCommonNames.length == 0, 'photos wrong latin names for these common names ' + bogusCommonNames)   
    })

    // it('renders sighting template', function () {
    //   assert.ok(templates.sighting(gApplication.allSightings.rows[0]).indexOf('undefined') < 0, 'rendered tempate should contain no undefined')
    // })

    // it('renders trips template', function () {
    //   assert.ok(templates.trips(gApplication.dataForTripsTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders trip template', function () {
    //   const req = {
    //     params: {
    //       trip_date: '03-10-2017'
    //     }
    //   }
    //   console.log('dir', __dirname)
    //   assert.ok(reactRender('/Users/walker/Dropbox/ebird-mybird/server/views/trip.jsx', reactViewOptions, function(err, source) {
    //     console.log('err', err)
    //     console.log('source', source)}))
    // })

    // it('renders year template', function () {
    //   const req = {
    //     params: {
    //       year: '2015'
    //     }
    //   }
    //   assert.ok(templates.year(gApplication.dataForYearTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders locations template', function () {
    //   assert.ok(templates.locations(gApplication.dataForLocationsTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders photos template', function () {
    //   assert.ok(templates.photos(gApplication.dataForPhotosTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders bigdays template', function () {
    //   assert.ok(templates.bigdays(gApplication.dataForBigdaysTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders taxons template', function () {
    //   assert.ok(templates.taxons(gApplication.dataForTaxonsTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders chrono template', function () {
    //   assert.ok(templates.chrono(gApplication.dataForChronoTemplate()).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders family template', function () {
    //   const req = {
    //     params: {
    //       family_name: 'Apodidae (Swifts)'
    //     }
    //   }
    //   assert.ok(templates.family(gApplication.dataForFamilyTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders sighting template', function () {
    //   const req = {
    //     params: {
    //       sighting_id: '29'
    //     }
    //   }
    //   assert.ok(templates.sighting(gApplication.dataForSightingTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders photo template', function () {
    //   const req = {
    //     params: {
    //       photo_id: '29'
    //     }
    //   }
    //   assert.ok(templates.photo(gApplication.dataForPhotoTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders location template', function () {
    //   const req = {
    //     params: {
    //       state_name: 'US-CA',
    //       county_name: 'Santa Clara',
    //       location_name: 'Charleston Slough'
    //     }
    //   }
    //   assert.ok(templates.location(gApplication.dataForLocationTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders county template', function () {
    //   const req = {
    //     params: {
    //       state_name: 'US-CA',
    //       county_name: 'Santa Clara'
    //     }
    //   }
    //   assert.ok(templates.county(gApplication.dataForCountyTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders state template', function () {
    //   const req = {
    //     params: {
    //       state_name: 'US-CA'
    //     }
    //   }
    //   assert.ok(templates.state(gApplication.dataForStateTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    // it('renders search template for sandpiper', function () {
    //   const req = {
    //     query: {
    //       searchtext: 'sandpiper'
    //     }
    //   }
    //   assert.ok(templates.searchresults(gApplication.dataForSearchTemplate(req)).indexOf('undefined') < 0, 'rendered template should contain no undefined')
    // })

    it('finds matches when searching for sandpiper', function () {
      const req = {
        query: {
          searchtext: 'sandpiper'
        }
      }
      let searchResults = gApplication.dataForSearchTemplate(req)
      assert.ok(searchResults.sightingList.length() > 0, 'should find some sightings matching common name')
    })

    it('finds matches when searching for wings', function () {
      const req = {
        query: {
          searchtext: 'wings'
        }
      }
      let searchResults = gApplication.dataForSearchTemplate(req)
      assert.ok(searchResults.sightingList.length() > 0, 'should find some sightings matching trip name')
    })

    it('finds matches when searching for domesticus', function () {
      const req = {
        query: {
          searchtext: 'domesticus'
        }
      }
      let searchResults = gApplication.dataForSearchTemplate(req)
      assert.ok(searchResults.sightingList.length() > 0, 'should find some sightings matching taxonomic name')
    })

    it('finds matches when searching for charleston', function () {
      const req = {
        query: {
          searchtext: 'charleston'
        }
      }
      let searchResults = gApplication.dataForSearchTemplate(req)
      assert.ok(searchResults.sightingList.length() > 0, 'should find some sightings matching location name')
    })


    it('finds matches when retrieving location with a County', function () {
      const req = {
          params: {
            state_name: 'US-CA',
            county_name: 'Santa Clara',
            location_name: 'Charleston Slough'
          }
      }
      let locationResults = gApplication.dataForLocationTemplate(req)
      assert.ok(locationResults.sightingList.length() > 0, 'should find some data for this location')
    })

    it('finds matches when retrieving location with no County', function () {
      const req = {
          params: {
            state_name: 'CH-AG',
            county_name: null,
            location_name: 'Klingnauer Stausee'
          }
      }
      let locationResults = gApplication.dataForLocationTemplate(req)
      assert.ok(locationResults.sightingList.length() > 0, 'should find some data for this location')
    })

    it('finds matches when searching for Ozaukee', function () {
      const req = {
        query: {
          searchtext: 'Ozaukee'
        }
      }
      let searchResults = gApplication.dataForSearchTemplate(req)
      assert.ok(searchResults.sightingList.length() > 0, 'should find some sightings matching county name')
    })

    it('finds matches when searching for least', function () {
      const req = {
        query: {
          searchtext: 'least'
        }
      }
      let searchResults = gApplication.dataForSearchTemplate(req)
      assert.ok(searchResults.sightingList.length() > 0, 'should find some sightings matching commmon name')
    })
  })

  describe('loadDayNamesAndOmittedNames', function () {
    it('got some data', function () {
      assert.ok(Object.keys(SightingList.getCustomDayNames()).length > 0, 'should have some custom day names')
      assert.ok(SightingList.getOmittedCommonNames().length > 0, 'should have some omitted species common names')
    })
  })
})
