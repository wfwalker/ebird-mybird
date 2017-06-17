var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
var moment = require('moment')
var { URL, URLSearchParams } = require('url')

class County extends BirdwalkerComponent {
  constructor(props) {
    super(props);
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

  generateThumbnails() {
		return (
	    <div className='mygallery'>
	    	{this.props.photos.map(p => (<a href={'/photo/' + p.id}><img alt={p['Common Name']} src={p['Photo URL']} /></a>))}
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

  render() {
  	const commonNames = this.props.sightingList.getUniqueValues('Common Name')
  	const locationNames = this.props.sightingList.getUniqueValues('Location')
  	return (
			<DefaultLayout title={this.props.title}>
				{this.generateHeading(this.props.name + ' County', 'TODO link' + this.lookupState(this.props.State) + ' ' + this.props.Country)}

				{this.generateThumbnails()}

				<h4>{commonNames.length} Species</h4>

				{this.generateSpeciesList(commonNames)}

				<div className='row'>
					<div className='col-md-4'>
						<h4>datelist</h4>
						{this.generateDateList()}
					</div>
					<div className='col-md-8'>
						<h4>{locationNames.length} locations</h4>
						{this.generateGoogleMap(this.props.sightingList)}
					</div>
				</div>
			</DefaultLayout>
		)
  }
}

export default County