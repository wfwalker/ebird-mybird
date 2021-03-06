var Handlebars = require('handlebars')
var fs = require('fs')
var moment = require('moment')
var { URL, URLSearchParams } = require('url')
var iso3166 = require('iso-3166-2')

require('./logger.js')

// https://stackoverflow.com/questions/3280323/get-week-of-the-month

Date.prototype.getWeekOfMonth = function(exact) {
    var month = this.getMonth()
        , year = this.getFullYear()
        , firstWeekday = new Date(year, month, 1).getDay()
        , lastDateOfMonth = new Date(year, month + 1, 0).getDate()
        , offsetDate = this.getDate() + firstWeekday - 1
        , index = 1 // start index at 0 or 1, your choice
        , weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
        , week = index + Math.floor(offsetDate / 7)
    ;
    if (exact || week < 2 + index) return week;
    return week === weeksInMonth ? index + 5 : week;
};

function registerHelpers () {
  Handlebars.registerHelper('nicedate', function (inDate) {
    if (inDate) {
      return new Handlebars.SafeString(
        moment(inDate).format('MMM D, Y')
      )
    } else {
      return new Handlebars.SafeString('Not a Date')
    } 
  })

  Handlebars.registerHelper('weekOfMonth', function (inDate) {
    if (inDate) {
      return new Handlebars.SafeString(
        moment.localeData().ordinal(inDate.getWeekOfMonth()) + ' week of ' + moment(inDate).format('MMM')
      )
    } else {
      return new Handlebars.SafeString('Not a Date')
    }
  })

  Handlebars.registerHelper('values', function (inList, inPropertyName) {
    return inList.getUniqueValues(inPropertyName)
  })

  Handlebars.registerHelper('locations', function (inList) {
    let triples = []
    let tmp = []

    for (let index = 0; index < inList.rows.length; index++) {
      let row = inList.rows[index]
      let triple = [row['State/Province'], row['County'], row['Location']]
      let code = triple.join('-')

      if (tmp.indexOf(code) === -1) {
        triples.push(triple)
        tmp.push(code)
      }
    }

    return triples
  })

  Handlebars.registerHelper('lookupState', function (inString) {
    logger.debug('lookupState', inString)
    if (inString == null || inString === '') {
      return 'None'
    } else if (!iso3166.subdivision(inString).name) {
      return inString
    } else {
      return iso3166.subdivision(inString).name
    }
  })

  Handlebars.registerHelper('addnone', function (inString) {
    if ((inString === '') || (inString == null)) {
      return 'none'
    } else {
      return inString
    }
  })

  Handlebars.registerHelper('random', function (inDictionary, inKey) {
    let tmp = inDictionary[inKey].length
    return inDictionary[inKey][Math.trunc(Math.random() * tmp)]
  })

  Handlebars.registerHelper('stripLatinFromEbirdFamily', function (inString) {
    return inString.replace(/.*\((.*)\)/, '$1')
  })

  Handlebars.registerHelper('valuecount', function (inList, inPropertyName) {
    return inList.getUniqueValues(inPropertyName).length
  })

  Handlebars.registerHelper('multiplevalues', function (inList, inPropertyName) {
    return inList.getUniqueValues(inPropertyName).length > 1
  })

  Handlebars.registerHelper('isnumber', function (inValue) {
    return !isNaN(inValue)
  })

  Handlebars.registerHelper('sortabledate', function (inDate) {
    return new Handlebars.SafeString(
      moment(inDate).format('Y-MM-DD')
    )
  })

  Handlebars.registerHelper('spacetodash', function (inString) {
    return new Handlebars.SafeString(
      inString.toLowerCase().replace(' ', '-')
    )
  })

  Handlebars.registerHelper('spacetounder', function (inString) {
    return new Handlebars.SafeString(
      inString.replace(' ', '_')
    )
  })

  Handlebars.registerHelper('encode', function (inString) {
    return encodeURIComponent(inString)
  })

  Handlebars.registerPartial('thumbnails',
    '<div class="mygallery"> \
    {{#each photos}} \
      <a href="/photo/{{id}}"><img alt="{{[Common Name]}}" src="{{[Photo URL]}}"></a> \
    {{/each}} \
    </div>'
  )

  Handlebars.registerPartial('specieslist',
    '<div class="biglist"> \
    {{#each (values sightingList "Common Name")}} \
      <div class="biglist-item"> \
        <a href="/taxon/{{encode this}}">{{this}}</a> \
      </div> \
    {{/each}} \
    </div>'
  )

  Handlebars.registerPartial('datelist', fs.readFileSync('server/templates/datelist.html', 'UTF-8'))

  Handlebars.registerHelper('nicenumber', function (inNumber) {
    return new Handlebars.SafeString(
      inNumber
    )
  })

  Handlebars.registerHelper('googlemap', function (inData, inElement) {
    let mapsURL = new URL('https://maps.googleapis.com/maps/api/staticmap')
    mapsURL.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY)
    mapsURL.searchParams.append('size', '640x360')
    let markers = inData.rows.map(row => row.Latitude + ',' + row.Longitude)
    let markerSet = new Set(markers)
    let markersNoDups = Array.from(markerSet)
    if (markersNoDups.length > 100) {
      markersNoDups = markersNoDups.slice(0, 100)
    }
    logger.debug('markers', markers.length, 'markersNoDups', markersNoDups.length)
    mapsURL.searchParams.append('markers', markersNoDups.join('|'))

    return new Handlebars.SafeString('<img class="img-responsive" src="' + mapsURL.toString() + '">')
  })

  Handlebars.registerHelper('monthgraph', function (inData, inElement) {
    // per @digitarald use timeout to reorder helper after Handlebars templating
    // byMonthForSightings(inData, '#' + inElement)

    let chartURL = new URL('https://chart.googleapis.com/chart')
    chartURL.searchParams.append('chxt', 'x,y')
    chartURL.searchParams.append('cht', 'bvs')
    let counts = inData.map(d => d.length)
    let maxCount = Math.max.apply(null, counts)
    chartURL.searchParams.append('chd', 't:' + counts.join(','))
    chartURL.searchParams.append('chds', '0,' + maxCount)
    chartURL.searchParams.append('chxl', '0:|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec')
    chartURL.searchParams.append('chxt', 'x,y')
    chartURL.searchParams.append('chxr', '1,0,' + maxCount)
    chartURL.searchParams.append('chbh', 'r,0,0')
    chartURL.searchParams.append('chco', '76A4FB')
    chartURL.searchParams.append('chls', '2.0')
    chartURL.searchParams.append('chs', '480x270')

    logger.debug(chartURL)

    return new Handlebars.SafeString('<img class="img-responsive" src="' + chartURL.toString() + '">')
  })
}

if (typeof module !== 'undefined') {
  module.exports = registerHelpers
}
