'use strict'

var iso3166 = require('iso-3166-2')
var fs = require('fs')
var babyParse = require('babyparse')

require('./logger.js')

// Submission ID, S7755084
// Common Name, Black-bellied Whistling-Duck
// Scientific Name, Dendrocygna autumnalis
// Taxonomic Order, 215
// Count, X
// State/Province, US-TX
// County, Cameron
// Location, Brownsville
// Latitude, 25.911388
// Longitude, -97.4904876
// Date, 04-17-2004
// Time,
// Protocol, eBird - Casual Observation
// Duration (Min),
// All Obs Reported,
// Distance Traveled (km),
// Area Covered (ha),
// Number of Observers,
// Breeding Code,
// Species Comments,
// Checklist Comments

var gCustomDayNames = {}
var gTripNotes = {}
var gOmittedCommonNames = []
var gFamilies = []
var gEBirdAll = []
var gLocationInfo = {}

const eBirdAllFilename = 'server/data/eBird_Taxonomy_v2017_18Aug2017.csv'

function convertDate (inDate) {
  var tmp = new Date(inDate)
  tmp.setTime(tmp.getTime() + tmp.getTimezoneOffset() * 60 * 1000)
  return tmp
}

class SightingList {
  constructor (inRows, inPhotos) {
    this.rows = []
    this._uniqueValuesCache = {}
    this.rowsByYear = {}
    this.rowsByMonth = { '01': [], '02': [], '03': [], '04': [], '05': [], '06': [], '07': [], '08': [], '09': [], '10': [], '11': [], '12': [] }
    this._speciesByDate = {}
    this.earliestDateObject = null
    this.latestDateObject = null
    this.dates = []
    this.dateObjects = []
    this.dayNames = []
    this.photos = inPhotos

    if (inRows) {
      if (inRows instanceof Array) {
        this.addRows(inRows)
      } else {
        throw new Error('not an array')
      }
    }
  }

  static taxonomicSortComparator(a, b) {
    return a['Taxonomic Order'] - b['Taxonomic Order']
  }

  static newFromCSV (inFilename) {
    let ebird = babyParse.parseFiles(inFilename, {
      header: true
    })

    logger.debug('parsed', inFilename, ebird.data.length)

    let newSightingList = new SightingList()
    newSightingList.addRows(ebird.data)
    newSightingList.setGlobalIDs()

    return newSightingList
  }

  static locationInfoFromJSON (inFilename) {
    let data = fs.readFileSync(inFilename, 'utf8')
    let tmpLocationInfo = JSON.parse(data)
    return tmpLocationInfo
  }

  static loadLocationInfo () {
    gLocationInfo = SightingList.locationInfoFromJSON('server/data/ca-info.json')
  }

  static loadEBirdTaxonomy () {
    const fileBytes = fs.readFileSync(eBirdAllFilename, 'utf8')

    let familyRanges = {}

    gEBirdAll = babyParse.parse(fileBytes, {
      header: true
    })

    logger.debug('parsed ebird all', gEBirdAll.data.length)

    for (let index = 0; index < gEBirdAll.data.length; index++) {
      let aValue = gEBirdAll.data[index]
      let aFamily = familyRanges[aValue['FAMILY']]
      let taxoValue = parseFloat(aValue['TAXON_ORDER'])

      if (aValue['FAMILY'] === '') {
        continue
      }

      if (aFamily != null) {
        familyRanges[aValue['FAMILY']][0] = Math.min(taxoValue, aFamily[0])
        familyRanges[aValue['FAMILY']][1] = Math.max(taxoValue, aFamily[1])
      } else {
        familyRanges[aValue['FAMILY']] = [taxoValue, taxoValue]
      }
    }

    let familyKeys = Object.keys(familyRanges)
    let familyTriples = []

    for (let index = 0; index < familyKeys.length; index++) {
      let aKey = familyKeys[index]
      let triple = [aKey, familyRanges[aKey][0], familyRanges[aKey][1]]
      familyTriples.push(triple)
    }

    gFamilies = familyTriples
  }

  // TODO: deal with taxo changes? try scientific name as well? deal with this at loading time?
  // LINEAR SEARCH!
  static getTaxoFromCommonName (inCommonName) {
    for (let index = 0; index < gEBirdAll.data.length; index++) {
      if (gEBirdAll.data[index]['PRIMARY_COM_NAME'] === inCommonName) {
        return parseFloat(gEBirdAll.data[index]['TAXON_ORDER'])
      }
    }

    return 'Unknown'
  }

  // TODO: deal with taxo changes? try scientific name as well? deal with this at loading time?
  // LINEAR SEARCH!

  // Possible values:
  //   Spuh:  Genus or identification at broad level -- e.g., duck sp., dabbling duck sp.
  //   Slash: Identification to Species-pair e.g., American Black Duck/Mallard)
  //   Species: e.g., Mallard
  //   ISSF or Identifiable Sub-specific Group: Identifiable subspecies or group of subspecies, e.g., Mallard (Mexican)
  //   Hybrid: Hybrid between two species, e.g., American Black Duck x Mallard (hybrid)
  //   Intergrade: Hybrid between two ISSF (subspecies or subspecies groups), e.g., Mallard (Mexican intergrade)
  //   Domestic: Distinctly-plumaged domesticated varieties that may be free-flying (these do not count on personal lists) e.g., Mallard (Domestic type)
  //   Form: Miscellaneous other taxa, including recently-described species yet to be accepted or distinctive forms that are not universally accepted (Red-tailed Hawk (Northern), Upland Goose (Bar-breasted))

  static getCategoryFromCommonName (inCommonName) {
    for (let index = 0; index < gEBirdAll.data.length; index++) {
      if (gEBirdAll.data[index]['PRIMARY_COM_NAME'] === inCommonName) {
        return gEBirdAll.data[index]['CATEGORY']
      }
    }

    return 'Unknown'
  }

  static newPhotosFromJSON (inFilename) {
    let data = fs.readFileSync(inFilename, 'utf8')
    let tmpPhotos = JSON.parse(data)

    for (let index = 0; index < tmpPhotos.length; index++) {
      let photo = tmpPhotos[index]

      // set unique index
      photo.id = index

      if (this.getCategoryFromCommonName(photo['Common Name']) == 'Unknown') {
        console.log('photos.json: No match in eBird for', photo)
      }

      // Parse the date
      let pieces = photo['Date'].split('-')

      // order the pieces in a sensible way
      let fixedDateString = [pieces[0], '/', pieces[1], '/', pieces[2]].join('')

      // create and save the new dat
      let newDate = new Date(fixedDateString)
      photo['DateObject'] = newDate

      // THUMBNAIL URL's:

      // https://s3.amazonaws.com/birdwalker/thumb
      // https://storage.googleapis.com/ebird-mybird.appspot.com/thumb/
      // http://res.cloudinary.com/birdwalker/c_limit,h_300,w_300/photo/

      // TODO: allow environment variable override

      const photoURLPrefix = 'https://s3.amazonaws.com/birdwalker/photo/'
      const thumbURLPrefix = 'https://s3.amazonaws.com/birdwalker/thumb/'

      // PHOTO URL's:

      // https://s3.amazonaws.com/birdwalker/photo/
      // https://storage.googleapis.com/ebird-mybird.appspot.com/photo/
      // http://res.cloudinary.com/birdwalker/photo/

      // add Photo URL and Thumbnail URL
      photo['Photo URL'] = photoURLPrefix + photo['Filename']
      photo['Thumbnail URL'] = thumbURLPrefix + photo['Filename']
    }

    logger.debug('parsed photos', tmpPhotos.length)
    return tmpPhotos
  }

  static getCustomDayNames () {
    return gCustomDayNames
  }

  static getLocationInfo () {
    return gLocationInfo
  }

  static getOmittedCommonNames () {
    return gOmittedCommonNames
  }

  static getTripNotes () {
    return gTripNotes
  }

  static getFamilies () {
    return gFamilies
  }

  static loadDayNamesAndOmittedNamesAndTripNotes () {
    let dayNames = fs.readFileSync('server/data/day-names.json')
    gCustomDayNames = JSON.parse(dayNames)
    logger.debug('loaded custom day names', Object.keys(gCustomDayNames).length)

    let omittedCommonNames = fs.readFileSync('server/data/omitted-common-names.json')
    gOmittedCommonNames = JSON.parse(omittedCommonNames)
    logger.debug('loaded omitted common names', Object.keys(gOmittedCommonNames).length)

    let tripNotes = fs.readFileSync('server/data/trip-notes.json')
    gTripNotes = JSON.parse(tripNotes)
    logger.debug('loaded trip notes', Object.keys(gTripNotes).length)
  }

  // families = []

  setGlobalIDs () {
    for (var index = 0; index < this.rows.length; index++) {
      var sighting = this.rows[index]
      sighting.id = index
    }
  }

  addRows (inRows) {
    for (let index = 0; index < inRows.length; index++) {
      let sighting = inRows[index]

      if (sighting['Date']) {
        // Parse the date
        let pieces = sighting['Date'].split('-')

        // order the pieces in a sensible way
        let fixedDateString = [pieces[0], '/', pieces[1], '/', pieces[2]].join('')

        // create and save the new date
        let newDate = convertDate(fixedDateString)
        sighting['DateObject'] = newDate

        // add custom day name 
        if (gCustomDayNames[sighting['Date']]) {
          sighting['customDayName'] = gCustomDayNames[sighting['Date']]
        }

        // add trip notes 
        if (gTripNotes[sighting['Date']]) {
          sighting['tripNotes'] = gTripNotes[sighting['Date']]
        }

        if (sighting['State/Province']) {
          let isoData = iso3166.subdivision(sighting['State/Province'])
          if (isoData) {
            sighting['Country'] = isoData['countryName']
          }
        }

        if (this.dates.indexOf(sighting['Date']) < 0) {
          this.dates.push(sighting['Date'])
          this.dateObjects.push(newDate)
          this.dayNames.push(gCustomDayNames[sighting['Date']])
        }

        if (this.earliestDateObject == null || newDate < this.earliestDateObject) {
          this.earliestDateObject = newDate
        }

        if (this.latestDateObject == null || newDate > this.latestDateObject) {
          this.latestDateObject = newDate
        }

        if (!this.rowsByYear[pieces[2]]) {
          this.rowsByYear[pieces[2]] = []
        }
        this.rowsByYear[pieces[2]].push(sighting)

        if (!this.rowsByMonth[pieces[0]]) {
          this.rowsByMonth[pieces[0]] = []
        }
        this.rowsByMonth[pieces[0]].push(sighting)
      } else {
        logger.debug('ERROR SIGHTING HAS NO DATE', index, JSON.stringify(sighting))
        inRows.splice(index, 1)
      }
    }

    this.rows = this.rows.concat(inRows)
  }

  sortByDate () {
    // TODO: this is probably unnecessary sort!
    this.rows.sort(function (a, b) { return a['DateObject'] - b['DateObject'] })
  }

  sortByLocation () {
    this.rows.sort(function (a, b) {
      if (a['State/Province'] < b['State/Province']) {
        return -1
      } else if (a['State/Province'] > b['State/Province']) {
        return 1
      } else {
        if (a['County'] < b['County']) {
          return -1
        } else if (a['County'] > b['County']) {
          return 1
        } else {
          if (a['Location'] < b['Location']) {
            return -1
          } else if (a['Location'] > b['Location']) {
            return 1
          } else {
            return 0
          }
        }
      }
    })
  }

  earliestDateObject () {
    return this.earliestDateObject
  }

  latestDateObject () {
    return this.latestDateObject
  }

  filter (filterFunc) {
    return this.rows.filter(filterFunc)
  }

  length () {
    return this.rows.length
  }

  byYear () {
    return this.rowsByYear
  }

  byMonth () {
    return [
      this.rowsByMonth['01'],
      this.rowsByMonth['02'],
      this.rowsByMonth['03'],
      this.rowsByMonth['04'],
      this.rowsByMonth['05'],
      this.rowsByMonth['06'],
      this.rowsByMonth['07'],
      this.rowsByMonth['08'],
      this.rowsByMonth['09'],
      this.rowsByMonth['10'],
      this.rowsByMonth['11'],
      this.rowsByMonth['12']
    ]
  }

  getUniqueValues (fieldName) {
    if (this._uniqueValuesCache[fieldName]) {
      // logger.debug('returning cached unique values for', fieldName)
    } else {
      // logger.debug('computing unique values for', fieldName)
      var tmpValues = []
      for (var index = 0; index < this.rows.length; index++) {
        var aValue = this.rows[index][fieldName]
        if (tmpValues.indexOf(aValue) < 0) {
          tmpValues.push(aValue)
        }
      }
      this._uniqueValuesCache[fieldName] = tmpValues
    }

    return this._uniqueValuesCache[fieldName]
  }

  getLocationHierarchy () {
    this.sortByLocation()

    var provinces = {}

    for (var index = 0; index < this.rows.length; index++) {
      var aSighting = this.rows[index]

      var province = aSighting['State/Province']
      var county = aSighting['County']
      var location = aSighting['Location']

      if (!provinces[province]) {
        provinces[province] = {}
      }

      if (!provinces[province][county]) {
        provinces[province][county] = []
      }

      if (provinces[province][county].indexOf(location) < 0) {
        provinces[province][county].push(location)
      }
    }

    return provinces
  }

  static getFamily (inTaxonomicOrderID) {
    for (var index = 0; index < gFamilies.length; index++) {
      var tmp = gFamilies[index]
      if ((tmp[1] <= inTaxonomicOrderID) && (inTaxonomicOrderID <= tmp[2])) {
        return tmp[0]
      }
    }

    return null
  }

  getTaxonomyHierarchy () {
    var byFamily = {}

    logger.debug(byFamily)

    for (var index = 0; index < this.rows.length; index++) {
      var aSighting = this.rows[index]
      var commonName = aSighting['Common Name']
      if (aSighting['Taxonomic Order']) {
        var taxoID = parseFloat(aSighting['Taxonomic Order'])
        var aFamily = SightingList.getFamily(taxoID)

        if (aFamily == null) {
          logger.debug(taxoID, commonName)
          continue
        }

        if (!byFamily[aFamily]) {
          byFamily[aFamily] = []
        }

        if (byFamily[aFamily].indexOf(commonName) < 0) {
          byFamily[aFamily].push(commonName)
        }
      } else {
        logger.debug('no scientific name', aSighting)
      }
    }

    return byFamily
  }

  // TODO: map also Protocol, Duration (Min), Time for Location

  mapSubmissionIDToSighting () {
    var tmpMap = {}

    for (var index = 0; index < this.rows.length; index++) {
      var sighting = this.rows[index]
      var submissionID = sighting['Submission ID']

      if (!tmpMap[submissionID]) {
        tmpMap[submissionID] = sighting
      }
    }

    return tmpMap
  }

  getDateTuples() {
    let tuples = []

    for (let i = 0; i < this.dates.length; i++) {
      let newTuple = { date: this.dates[i], dateObject: this.dateObjects[i], customDayName: this.dayNames[i] }
      tuples.push(newTuple)
    }

    tuples.sort((a, b) => (b.dateObject - a.dateObject))

    return tuples
  }

  getLocationTriples() {
    let triples = []
    let tmp = []

    for (let index = 0; index < this.rows.length; index++) {
      let row = this.rows[index]
      let triple = [row['State/Province'], row['County'], row['Location']]
      let code = triple.join('-')

      if (tmp.indexOf(code) === -1) {
        triples.push(triple)
        tmp.push(code)
      }
    }

    return triples
  }

  getSpeciesByDate () {
    logger.debug('computing speciesByDate')

    for (var index = 0; index < this.rows.length; index++) {
      var sighting = this.rows[index]

      if (!this._speciesByDate[sighting['Date']]) {
        this._speciesByDate[sighting['Date']] = {
          commonNames: [],
          dateObject: sighting['DateObject']
        }
      }
      if (this._speciesByDate[sighting['Date']].commonNames.indexOf(sighting['Common Name']) < 0) {
        this._speciesByDate[sighting['Date']].commonNames.push(sighting['Common Name'])
      }
    }

    return this._speciesByDate
  }

  getEarliestSightings () {
    let earliestRowByCommonName = {}

    for (var index = 0; index < this.rows.length; index++) {
      var sighting = this.rows[index]

      if (gOmittedCommonNames.indexOf(sighting['Common Name']) < 0) {
        if (!earliestRowByCommonName[sighting['Common Name']]) {
          earliestRowByCommonName[sighting['Common Name']] = sighting
        } else if (sighting.DateObject < earliestRowByCommonName[sighting['Common Name']].DateObject) {
          earliestRowByCommonName[sighting['Common Name']] = sighting
        }
      } else {
        // logger.debug('omit', sighting['Common Name'])
      }
    }

    return Object.keys(earliestRowByCommonName).map(k => earliestRowByCommonName[k])
  }

  // Return as many as possible recent photos from the list, up to the supplied limit
  // for uses see application.js
  getLatestPhotos (inPhotoCount) {
    if (this.photos.length <= inPhotoCount) {
      // if the limit exceeds the available photos, return all of them.
      return this.photos
    } else {
      // sort the photos into date order and return up to the supplied limit
      // NOTE: assumes you have read the photos and added DatObject field to them.
      // see server.js code for reading photos.json
      this.photos.sort(function (a, b) {
        return a.DateObject < b.DateObject
      })

      return this.photos.slice(0, inPhotoCount)
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = SightingList
}
