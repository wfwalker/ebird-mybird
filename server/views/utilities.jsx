var moment = require('moment')
var React = require('react');
var { URL, URLSearchParams } = require('url')

const Thumbnail = (props) => {
  return (
    <a href={'/photo/' + props.photo.id}><img alt={props.photo['Common Name']} src={props.photo['Photo URL']} /></a>
  )
}

const TaxonLink = (props) => {
  return (
    <div key={props.commonName} className='biglist-item'><a href={'/taxon/' + props.commonName}>{props.commonName}</a></div>
  )
}

const TripLink = (props) => {
  return (
    <div className='biglist-item'>
      <a href={'/trip/' + moment(props.tuple.dateObject).format('MM-DD-YYYY')}>{moment(props.tuple.dateObject).format('MMM DD, YYYY')}</a> {props.tuple.customDayName}
    </div>
  )
}

const MonthGraph = (props) => {
  let chartURL = new URL('https://chart.googleapis.com/chart')
  chartURL.searchParams.append('chxt', 'x,y')
  chartURL.searchParams.append('cht', 'bvs')
  let counts = props.byMonth.map(d => d.length)
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

  return (<img className='img-responsive' src={chartURL.toString()} />)
}

export { Thumbnail, TripLink, TaxonLink, MonthGraph }