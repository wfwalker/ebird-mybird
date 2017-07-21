var React = require('react');
var { URL, URLSearchParams } = require('url')

class LocationMap extends React.Component {
  render() {
    let mapsURL = new URL('https://maps.googleapis.com/maps/api/staticmap')

    mapsURL.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY)
    mapsURL.searchParams.append('size', '640x360')

    let markers = this.props.data.rows.map(row => row.Latitude + ',' + row.Longitude)
    let markerSet = new Set(markers)
    let markersNoDups = Array.from(markerSet)

    if (markersNoDups.length > 100) {
      markersNoDups = markersNoDups.slice(0, 100)
    }

    if (markersNoDups.length == 1) {
        mapsURL.searchParams.append('zoom', '5')
    }

    mapsURL.searchParams.append('markers', markersNoDups.join('|'))

    return (<img className='img-responsive' src={mapsURL.toString()} />)    
  }
}

export default LocationMap