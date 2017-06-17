var React = require('react');
var iso3166 = require('iso-3166-2')
var moment = require('moment')
var { URL, URLSearchParams } = require('url')

class BirdwalkerComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  generateTripLink(t) {
  	return (
			<div className='biglist-item'>
				<a href={'/trip/' + moment(t).format('MM-DD-YYYY')}>{moment(t).format('MMM, DD, YYYY')}</a> {this.getCustomDayNameForDate(t)}
			</div>
  	)
  }

  generateLinkForCommonName(cn) {
  	return (
	    <div key={cn} className='biglist-item'><a href={'/taxon/' + cn}>{cn}</a></div>
		)
  }

  generateSpeciesList(commonNames) {
  	return (
	    <div className='biglist'>
		    {commonNames.map(cn => this.generateLinkForCommonName(cn))}
	    </div>
		)
  }

  generateThumbnails() {
		return (
	    <div className='mygallery'>
	    	{this.props.photos.map(p => (<a href={'/photo/' + p.id}><img alt={p['Common Name']} src={p['Photo URL']} /></a>))}
	    </div>
		)  	
  }

  generateMonthGraph(inData) {
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

    return (<img className='img-responsive' src={chartURL.toString()} />)
  }

  generateGoogleMap(inData) {
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

    return (<img className='img-responsive' src={mapsURL.toString()} />)
  }

  generateDateList() {
  	if (this.props.showDates) {
	  	return (
					<div class="biglist">
						{this.props.sightingList.dateObjects.map(d => (this.generateTripLink(d)))}
					</div>
			)
  	} else {
	  	return (
					<div id={this.props.chartID} class='bargraph'>
						{this.generateMonthGraph(this.props.sightingsByMonth)}
					</div>
			)
	  }
	}

  getCustomDayNameForDate(inDate) {
  	return this.props.customDayNames[moment(inDate).format('MM-DD-YYYY')]
  }

	lookupState(inString) {
		if (inString == null || inString === '') {
			return 'None'
		} else if (!iso3166.subdivision(inString).name) {
			return inString
		} else {
			return iso3166.subdivision(inString).name
		}
	}

	generateHeading(title, subtitle) {
		if (subtitle) {
			return (<h3>{title} <span className='lighter'>{subtitle}</span></h3>)
		} else {
			return (<h3>{title}</h3>)
		}
	}
}

export default BirdwalkerComponent