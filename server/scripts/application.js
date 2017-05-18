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
