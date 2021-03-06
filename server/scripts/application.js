'use strict'

const SightingList = require('./sightinglist.js')
var moment = require('moment')
require('./logger.js')

// TODO: make helper for customDayNames, stop passing around
// TOOD: unify page title
// TODO: unify fixed data filenames
// TODO: move some code out to sightingList or photoList

class Application {
  constructor (inAllSightings, inAllPhotos) {
    this.allSightings = inAllSightings
    this.allPhotos = inAllPhotos
  }

  static withFullData () {
    SightingList.loadDayNamesAndOmittedNamesAndTripNotes()
    SightingList.loadEBirdTaxonomy()
    let fullSightingList = SightingList.newFromCSV('server/data/ebird.csv')
    let fullPhotos = SightingList.newPhotosFromJSON('server/data/photos.json')
    SightingList.loadLocationInfo()

    return new Application(fullSightingList, fullPhotos)
  }

  dataForSightingTemplate (req) {
    // NO NO NO! Cannot index into the list! Must match ID field!
    return this.allSightings.rows[req.params.sighting_id]
  }

  dataForPhotoTemplate (req) {
    // NO NO NO! Cannot index into the list! Must match ID field!
    let matching_ids = this.allPhotos.filter((p) => (p.id == req.params.photo_id))
    return matching_ids[0]
  }

  dataForSearchTemplate (req) {
    logger.debug('dataForSearchTemplate', req.query)
    let lowerCaseQuery = req.query.searchtext.toLowerCase()

    // TODO: stop making unstructured pile of sightings and instead try to redirect to the right page
    let resultsAsSightings = this.allSightings.filter((s) => (
      (s['customDayName'] && s['customDayName'].toLowerCase().indexOf(lowerCaseQuery) >= 0) ||
      (s['Common Name'] && s['Common Name'].toLowerCase().indexOf(lowerCaseQuery) >= 0) ||
      (s['Location'] && s['Location'].toLowerCase().indexOf(lowerCaseQuery) >= 0) ||
      (s['County'] && s['County'].toLowerCase().indexOf(lowerCaseQuery) >= 0) ||
      (s['Scientific Name'] && s['Scientific Name'].toLowerCase().indexOf(lowerCaseQuery) >= 0) ||
      (s['tripNotes'] && s['tripNotes'].toLowerCase().indexOf(lowerCaseQuery) >= 0)
    ))

    let matchingPhotos = this.allPhotos.filter((p) => (
      (p['Common Name'].toLowerCase().indexOf(lowerCaseQuery) >= 0) ||
      (p['Scientific Name'].toLowerCase().indexOf(lowerCaseQuery) >= 0) ||
      (p['Location'].toLowerCase().indexOf(lowerCaseQuery) >= 0)
    ))

    console.log('matching photos', lowerCaseQuery, matchingPhotos.length)

    let searchResultsSightingList = new SightingList(resultsAsSightings)

    return {
      dates: searchResultsSightingList.dateObjects,
      customDayNames: SightingList.getCustomDayNames(),
      sightingList: searchResultsSightingList,
      searchtext: req.query.searchtext,
      photos: matchingPhotos
    }
  }

  dataForTripsTemplate () {
    return {
      tuples: this.allSightings.getDateTuples(),
    }
  }

  dataForLocationsTemplate () {
    return {
      count: this.allSightings.getUniqueValues('Location').length,
      hierarchy: this.allSightings.getLocationHierarchy(),
      sightingList: this.allSightings
    }
  }

  dataForBigdaysTemplate () {
    let speciesByDate = this.allSightings.getSpeciesByDate()
    let bigDayPairs = Object.keys(speciesByDate).map(dateString => [dateString, speciesByDate[dateString]])
    bigDayPairs = bigDayPairs.filter(bigDayPair => (bigDayPair[1].commonNames.length > 100))
    let bigDayObjects = bigDayPairs.map(bigDayPair => ({ date: bigDayPair[0], customName: SightingList.getCustomDayNames()[bigDayPair[0]], dateObject: bigDayPair[1].dateObject, count: bigDayPair[1].commonNames.length }))
    bigDayObjects.sort((x, y) => (y.count - x.count))

    // TODO: look up the custom day names for those days, don't just pass down the whole dang thing

    return {
      bigDays: bigDayObjects
    }
  }

  dataForChronoTemplate () {
    // retrieve the earliest sightings for each species
    let lifeSightingsChronological = this.allSightings.getEarliestSightings()

    // sort those sightings by date
    lifeSightingsChronological.sort(function (a, b) { return b['DateObject'] - a['DateObject'] })

    // filter out "spuh" and subspecies records
    lifeSightingsChronological = lifeSightingsChronological.filter(ls => (SightingList.getCategoryFromCommonName(ls['Common Name']) == 'species'))

    return {
      firstSightingList: new SightingList(lifeSightingsChronological)
    }
  }

  dataForTaxonsTemplate () {
    // retrieve the earliest sightings for each species
    let lifeSightingsTaxonomic = this.allSightings.getEarliestSightings()
    lifeSightingsTaxonomic.sort(SightingList.taxonomicSortComparator)
    let lifeSightingsList = new SightingList(lifeSightingsTaxonomic)

    return {
      lifeSightingsCount: lifeSightingsList.length(),
      hierarchy: lifeSightingsList.getTaxonomyHierarchy(),
      sightingList: lifeSightingsList
    }
  }

  dataForTaxonTemplate (req) {
    let tmp = this.allSightings.filter((s) => (s['Common Name'] === req.params.common_name))
    let photos = this.allPhotos.filter((p) => (p['Common Name'] === req.params.common_name))

    let taxonSightingList = new SightingList(tmp, photos)
    taxonSightingList.sortByDate()

    let family_name = Object.keys(taxonSightingList.getTaxonomyHierarchy())[0]
    logger.debug('dataForTaxonTemplate, family name', family_name)

    return {
      name: req.params.common_name,
      family_name: family_name,
      category: SightingList.getCategoryFromCommonName(req.params.common_name),
      scientificName: taxonSightingList.rows[0]['Scientific Name'],
      photos: taxonSightingList.photos,
      sightingList: taxonSightingList
    }
  }

  dataForFamilyTemplate (req) {
    let tmp = this.allSightings.filter((s) => (SightingList.getFamily(s['Taxonomic Order']) === req.params.family_name))
    tmp.sort(SightingList.taxonomicSortComparator)
    let photos = this.allPhotos.filter((p) => (SightingList.getFamily(SightingList.getTaxoFromCommonName(p['Common Name'])) === req.params.family_name))

    let familySightingList = new SightingList(tmp, photos)

    logger.debug('/family/', req.params.family_name, familySightingList.rows.length)

    return {
      name: req.params.family_name,
      photos: familySightingList.getLatestPhotos(20),
      sightingList: familySightingList,
      taxons: familySightingList.commonNames,
      customDayNames: SightingList.getCustomDayNames()
    }
  }

  dataForLocationTemplate (req) {
    // with dynamicTyping in papaParse CVS parser, empty county name from eBird CSV is turned into actual null
    if (req.params.county_name === 'none') {
      req.params.county_name = null
    }

    let tmp = this.allSightings.filter((s) => (s['State/Province'] === req.params.state_name) && (s['County'] === req.params.county_name) && (s['Location'] === req.params.location_name))
    tmp.sort(SightingList.taxonomicSortComparator)

    // TODO: wrong, doesn't handle duplication location names
    let photos = this.allPhotos.filter(function (p) { return p.Location === req.params.location_name })

    let locationSightingList = new SightingList(tmp, photos)

    logger.debug('/location/', req.params.state_name, req.params.county_name, req.params.location_name, locationSightingList.rows.length)

    return {
      name: req.params.location_name,
      county: req.params.county_name,
      state: req.params.state_name,
      photos: locationSightingList.getLatestPhotos(20),
      sightingList: locationSightingList,
      locationInfo: SightingList.getLocationInfo().filter(l => l.locName == req.params.location_name),
      customDayNames: SightingList.getCustomDayNames()
    }
  }

  dataForCountyTemplate (req) {
    // with dynamicTyping in papaParse CVS parser, empty county name from eBird CSV is turned into actual null
    if (req.params.county_name === 'none') {
      req.params.county_name = null
    }

    let tmp = this.allSightings.filter((s) => (s['State/Province'] === req.params.state_name) && (s['County'] === req.params.county_name))
    tmp.sort(SightingList.taxonomicSortComparator)

    let countySightingList = new SightingList(tmp)
    // TODO: can't compute photos before creating list
    let countyLocations = countySightingList.getUniqueValues('Location')
    countySightingList.photos = this.allPhotos.filter((p) => (countyLocations.indexOf(p.Location) >= 0))

    logger.debug('/county/', req.params.county_name, countySightingList.length())

    return {
      name: req.params.county_name,
      photos: countySightingList.getLatestPhotos(20),
      State: countySightingList.rows[0]['State/Province'],
      Region: countySightingList.rows[0]['Region'],
      Country: countySightingList.rows[0]['Country'],
      sightingList: countySightingList,
      taxons: countySightingList.commonNames,
      customDayNames: SightingList.getCustomDayNames()
    }
  }

  dataForStateTemplate (req) {
    let tmp = this.allSightings.filter((s) => (s['State/Province'] === req.params.state_name))
    tmp.sort(SightingList.taxonomicSortComparator)

    let stateSightingList = new SightingList(tmp)
    // TODO: can't compute photos before creating list
    let stateLocations = stateSightingList.getUniqueValues('Location')
    stateSightingList.photos = this.allPhotos.filter(function (p) { return stateLocations.indexOf(p.Location) >= 0 })

    logger.debug('/state/', req.params.state_name, stateSightingList.length())

    return {
      name: req.params.state_name,
      photos: stateSightingList.getLatestPhotos(20),
      State: stateSightingList.rows[0]['State/Province'],
      Country: stateSightingList.rows[0]['Country'],
      sightingList: stateSightingList,
      taxons: stateSightingList.commonNames,
      customDayNames: SightingList.getCustomDayNames(),
      hierarchy: stateSightingList.getLocationHierarchy()
    }
  }

  dataForTripTemplate (req) {
    let tmp = this.allSightings.filter((s) => (s['Date'] === req.params.trip_date))
    if (tmp.length == 0) {
      throw new Error("No sightings for " + req.params.trip_date)
    }
    tmp.sort(SightingList.taxonomicSortComparator)
    let photos = this.allPhotos.filter((p) => (p.Date === req.params.trip_date))

    let tripSightingList = new SightingList(tmp, photos)

    return {
      tripDate: tripSightingList.rows[0].DateObject,
      photos: tripSightingList.photos,
      customName: tripSightingList.rows[0].customDayName,
      submissionIDToSighting: tripSightingList.mapSubmissionIDToSighting(),
      comments: tripSightingList.getUniqueValues('Checklist Comments'),
      sightingList: tripSightingList
    }
  }

  dataForYearTemplate (req) {
    let numericYear = parseInt(req.params.year)
    let tmp = this.allSightings.byYear()[req.params.year]
    tmp.sort(SightingList.taxonomicSortComparator)
    let photos = this.allPhotos.filter((p) => (p.DateObject.getFullYear() === numericYear))
    let yearSightingList = new SightingList(tmp, photos)

    return {
      year: req.params.year,
      photos: yearSightingList.photos,
      sightingList: yearSightingList
    }
  }

  dataForYearAndMonthTemplate (req) {
    let numericMonth = parseInt(req.params.month)
    let numericYear = parseInt(req.params.year)

    let tmpSightings = this.allSightings.filter((s) => {
      let monthMatch = (s['DateObject'].getMonth() + 1) == numericMonth
      let yearMatch = s['DateObject'].getFullYear() == numericYear
      return monthMatch && yearMatch
    })

    tmpSightings.sort(SightingList.taxonomicSortComparator)

    let photos = this.allPhotos.filter((p) => {
      let yearMatch = p.DateObject.getFullYear() === numericYear
      let monthMatch = (p.DateObject.getMonth() + 1) === numericMonth
      return monthMatch && yearMatch
    })

    let yearAndMonthSightingList = new SightingList(tmpSightings, photos)

    return {
      year: req.params.year,
      month: req.params.month,
      photos: yearAndMonthSightingList.getLatestPhotos(20),
      sightingList: yearAndMonthSightingList
    }
  }

  dataForPhotosDayOfYearTemplate (req) {
    let currentDayOfYear = parseInt(req.params.dayofyear)

    let photosThisWeek = this.allPhotos.filter((p) => {
      let photoDayOfYear = moment(p.DateObject).dayOfYear()
      return ((currentDayOfYear - 5) < photoDayOfYear) && (photoDayOfYear < (currentDayOfYear + 5))
    })

    let sightingsThisWeek = this.allSightings.filter((s) =>  {
      let sightingDayOfYear = moment(s['DateObject']).dayOfYear()
      return ((currentDayOfYear - 5) < sightingDayOfYear) && (sightingDayOfYear < (currentDayOfYear + 5))
    })
    let sightingsThisWeekList = new SightingList(sightingsThisWeek)

    logger.debug('photos of the week', currentDayOfYear, photosThisWeek.length)
    logger.debug('sightings of the week', currentDayOfYear, sightingsThisWeek.length)

    return {
      photos: photosThisWeek,
      sightingList: sightingsThisWeekList,
      currentDayOfYear: currentDayOfYear,
      startDayOfYear: moment().startOf('year').add(currentDayOfYear, 'days').subtract(5, 'days').format('MMMM Do'),
      endDayOfYear: moment().startOf('year').add(currentDayOfYear, 'days').add(5, 'days').format('MMMM Do')
    }
  }

  dataForPhotosTemplate () {
    let currentDayOfYear = moment().dayOfYear()
    let photosThisWeek = this.allPhotos.filter((p) => {
      let photoDayOfYear = moment(p.DateObject).dayOfYear()
      return ((currentDayOfYear - 5) < photoDayOfYear) && (photoDayOfYear < (currentDayOfYear + 5))
    })

    let commonNamesByFamily = {}
    let photosByFamily = {}
    let photoCommonNamesByFamily = []
    let speciesPhotographed = 0

    // make an array of common name, taxonomic id, and family name
    // TODO: can do this when importing photos?
    for (let index = 0; index < this.allPhotos.length; index++) {
      let aPhoto = this.allPhotos[index]

      aPhoto.taxonomicSort = SightingList.getTaxoFromCommonName(aPhoto['Common Name'])
      aPhoto.family = SightingList.getFamily(aPhoto.taxonomicSort)
      if (aPhoto.family === null) {
        logger.debug('photo.family === null', aPhoto)
      }
      photoCommonNamesByFamily.push({'Common Name': aPhoto['Common Name'], taxonomicSort: aPhoto.taxonomicSort, family: aPhoto.family})

      if (!photosByFamily[aPhoto.family]) {
        photosByFamily[aPhoto.family] = []
      }

      photosByFamily[aPhoto.family].push(aPhoto)
    }

    // sort that array by taxonomic id

    photoCommonNamesByFamily.sort(function (x, y) { return x.taxonomicSort - y.taxonomicSort })

    // loop through that array and group into families

    for (let index = 0; index < photoCommonNamesByFamily.length; index++) {
      let aPhoto = photoCommonNamesByFamily[index]
      if (aPhoto.family === null) {
        logger.debug('photo.family === null', aPhoto)
        continue
      }

      if (!commonNamesByFamily[aPhoto.family]) {
        commonNamesByFamily[aPhoto.family] = []
      }

      if (commonNamesByFamily[aPhoto.family].indexOf(aPhoto['Common Name']) < 0) {
        commonNamesByFamily[aPhoto.family].push(aPhoto['Common Name'])
        speciesPhotographed = speciesPhotographed + 1
      }
    }

    logger.debug('/photos')

    // pass down to the page template all the photo data plus the list of common names in taxo order
    return {
      numSpecies: speciesPhotographed,
      photosByFamily: photosByFamily,
      hierarchy: commonNamesByFamily,
      photosThisWeek: photosThisWeek,
      currentDayOfYear: currentDayOfYear,
      startDayOfYear: moment().subtract(5, 'days').format('MMM D'),
      endDayOfYear: moment().add(5, 'days').format('MMM D')
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = Application
}
