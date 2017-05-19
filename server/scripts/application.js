'use strict'

const SightingList = require('./sightinglist.js')
require('./logger.js')

// ADD getWeek to Date class

Date.prototype.getWeek = function () {
  let dt = new Date(this.getFullYear(), 0, 1)
  return Math.ceil((((this - dt) / 86400000) + dt.getDay() + 1) / 7)
}

class Application {
  constructor (inAllSightings, inAllPhotos) {
    this.allSightings = inAllSightings
    this.allPhotos = inAllPhotos
  }

  dataForTripsTemplate () {
    return {
      trips: this.allSightings.dateObjects,
      customDayNames: SightingList.getCustomDayNames()
    }
  }

  dataForLocationsTemplate () {
    return {
      count: this.allSightings.getUniqueValues('Location').length,
      hierarchy: this.allSightings.getLocationHierarchy()
    }
  }

  dataForBigdaysTemplate() {
    let speciesByDate = this.allSightings.getSpeciesByDate()
    let bigDays = Object.keys(speciesByDate).map(function (key) { return [key, speciesByDate[key]] })
    bigDays = bigDays.filter(function (x) { return x[1].commonNames.length > 100 })
    bigDays = bigDays.map(function (x) { return { date: x[0], dateObject: x[1].dateObject, count: x[1].commonNames.length } })
    bigDays.sort(function (x, y) { return y.count - x.count })

    // TODO: look up the custom day names for those days, don't just pass down the whole dang thing

    return {
      bigDays: bigDays,
      customDayNames: SightingList.getCustomDayNames()
    }
  }

  dataForChronoTemplate() {
    let earliestByCommonName = this.allSightings.getEarliestByCommonName()
    let lifeSightingsChronological = Object.keys(earliestByCommonName).map(function (k) { return earliestByCommonName[k] })
    lifeSightingsChronological.sort(function (a, b) { return b['DateObject'] - a['DateObject'] })

    return {
      firstSightings: lifeSightingsChronological
    }
  }

  dataForTaxonsTemplate () {
    let earliestByCommonName = this.allSightings.getEarliestByCommonName()
    let lifeSightingsTaxonomic = Object.keys(earliestByCommonName).map(function (k) { return earliestByCommonName[k] })
    lifeSightingsTaxonomic.sort(function (a, b) { return a['Taxonomic Order'] - b['Taxonomic Order'] })
    let lifeSightingsList = new SightingList(lifeSightingsTaxonomic)

    return {
      lifeSightingsCount: lifeSightingsList.length(),
      hierarchy: lifeSightingsList.getTaxonomyHierarchy()
    }
  }

  dataForTaxonTemplate (req) {
    let tmp = this.allSightings.filter(function (s) { return s['Common Name'] === req.params.common_name })
    let photos = this.allPhotos.filter(function (p) { return p['Common Name'] === req.params.common_name })

    let taxonSightingList = new SightingList(tmp, photos)
    taxonSightingList.sortByDate()

    return {
      name: req.params.common_name,
      showDates: taxonSightingList.length() < 30,
      scientificName: taxonSightingList.rows[0]['Scientific Name'],
      sightingsByMonth: taxonSightingList.byMonth(),
      photos: taxonSightingList.photos,
      sightingList: taxonSightingList,
      customDayNames: SightingList.getCustomDayNames()
    }
  }

  dataForFamilyTemplate (req) {
    let tmp = this.allSightings.filter(function (s) { return SightingList.getFamily(s['Taxonomic Order']) === req.params.family_name })
    tmp.sort(function (a, b) { return a['Taxonomic Order'] - b['Taxonomic Order'] })
    let photos = this.allPhotos.filter(function (p) { return SightingList.getFamily(SightingList.getTaxoFromCommonName(p['Common Name'])) === req.params.family_name })

    let familySightingList = new SightingList(tmp, photos)

    logger.debug('/family/', req.params.family_name, familySightingList.rows.length)

    return {
      name: req.params.family_name,
      showDates: familySightingList.dateObjects.length < 30,
      showLocations: familySightingList.getUniqueValues('Location').length < 30,
      sightingsByMonth: familySightingList.byMonth(),
      photos: familySightingList.getLatestPhotos(20),
      sightingList: familySightingList,
      taxons: familySightingList.commonNames,
      customDayNames: SightingList.getCustomDayNames()
    }
  }

  dataForLocationTemplate (req) {
    if (req.params.county_name === 'none') {
      req.params.county_name = ''
    }

    let tmp = this.allSightings.filter(function (s) {
      return (s['State/Province'] === req.params.state_name) && (s['County'] === req.params.county_name) && (s['Location'] === req.params.location_name)
    })
    tmp.sort(function (a, b) { return a['Taxonomic Order'] - b['Taxonomic Order'] })

    // TODO: wrong, doesn't handle duplication location names
    let photos = this.allPhotos.filter(function (p) { return p.Location === req.params.location_name })

    let locationSightingList = new SightingList(tmp, photos)

    logger.debug('/location/', req.params.state_name, req.params.county_name, req.params.location_name, locationSightingList.rows.length)

    return {
      name: req.params.location_name,
      showChart: locationSightingList.dateObjects.length > 20,
      sightingsByMonth: locationSightingList.byMonth(),
      photos: locationSightingList.getLatestPhotos(20),
      sightingList: locationSightingList,
      customDayNames: SightingList.getCustomDayNames()
    }
  }

  dataForCountyTemplate (req) {
    if (req.params.county_name === 'none') {
      req.params.county_name = ''
    }

    let tmp = this.allSightings.filter(function (s) {
      return (s['State/Province'] === req.params.state_name) && (s['County'] === req.params.county_name)
    })

    tmp.sort(function (a, b) { return a['Taxonomic Order'] - b['Taxonomic Order'] })

    let countySightingList = new SightingList(tmp)
    // TODO: can't compute photos before creating list
    let countyLocations = countySightingList.getUniqueValues('Location')
    countySightingList.photos = this.allPhotos.filter(function (p) { return countyLocations.indexOf(p.Location) >= 0 })

    logger.debug('/county/', req.params.county_name, countySightingList.length())

    return {
      name: req.params.county_name,
      showDates: countySightingList.getUniqueValues('Date').length < 30,
      sightingsByMonth: countySightingList.byMonth(),
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
    let tmp = this.allSightings.filter(function (s) {
      return s['State/Province'] === req.params.state_name
    })
    tmp.sort(function (a, b) { return a['Taxonomic Order'] - b['Taxonomic Order'] })

    let stateSightingList = new SightingList(tmp)
    // TODO: can't compute photos before creating list
    let stateLocations = stateSightingList.getUniqueValues('Location')
    stateSightingList.photos = this.allPhotos.filter(function (p) { return stateLocations.indexOf(p.Location) >= 0 })

    logger.debug('/state/', req.params.state_name, stateSightingList.length())

    return {
      name: req.params.state_name,
      showDates: stateSightingList.getUniqueValues('Date').length < 30,
      sightingsByMonth: stateSightingList.byMonth(),
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
    let tmp = this.allSightings.filter(function (s) { return s['Date'] === req.params.trip_date })
    tmp.sort(function (a, b) { return a['Taxonomic Order'] - b['Taxonomic Order'] })
    let photos = gPhotos.filter(function (p) { return p.Date === req.params.trip_date })

    let tripSightingList = new SightingList(tmp, photos)

    return {
      tripDate: tripSightingList.rows[0].DateObject,
      photos: tripSightingList.photos,
      customName: tripSightingList.dayNames[0],
      submissionIDToSighting: tripSightingList.mapSubmissionIDToSighting(),
      comments: tripSightingList.getUniqueValues('Checklist Comments'),
      sightingList: tripSightingList
    }
  }

  dataForPhotosTemplate () {
    let currentWeekOfYear = new Date().getWeek()
    let photosThisWeek = this.allPhotos.filter(function (p) { return p.DateObject.getWeek() === currentWeekOfYear })

    logger.debug('photos of the week', currentWeekOfYear, photosThisWeek.length)

    let commonNamesByFamily = {}
    let photosByFamily = {}
    let photoCommonNamesByFamily = []
    let speciesPhotographed = 0

    // make an array of common name, taxonomic id, and family name

    for (let index = 0; index < this.allPhotos.length; index++) {
      let aPhoto = this.allPhotos[index]

      aPhoto.taxonomicSort = SightingList.getTaxoFromCommonName(aPhoto['Common Name'])
      aPhoto.family = SightingList.getFamily(aPhoto.taxonomicSort)
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
      numPhotos: this.allPhotos.length,
      numSpecies: speciesPhotographed,
      photosByFamily: photosByFamily,
      hierarchy: commonNamesByFamily,
      photosThisWeek: photosThisWeek
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = Application
}
