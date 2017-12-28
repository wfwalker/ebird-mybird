var React = require('react');

class LocationsVRScene extends React.Component {
  render() {
    let markers = this.props.data.rows.map(row => row.Latitude + ',' + row.Longitude + ',' + row.Location)
    let markerSet = new Set(markers)
    let markersNoDups = Array.from(markerSet)

    return (
        <html>
        <head>
            <script src="/scripts/aframe-master.js"></script>
        </head>
        <body>
        <a-scene>
            <a-entity position="24 2 -124" camera look-controls wasd-controls >
            </a-entity>
            {markersNoDups.map(marker => {
                let parts = marker.split(',')
                return (
                    <a-entity>
                    <a-box width={ 0.1 } height={ 0.1 } depth={ 0.1 } position={ parts[0] + ' 0 ' + parts[1] } color={ 'red' } />
                    <a-text width= { 1.5 } position={ parts[0] + ' 0.3 ' + parts[1] } color={ 'black' } value={ parts[2] } />
                    </a-entity>
                )
            })}
            <a-box position="36.5 -0.1 -95" width="25" depth="66" height="0.1" color="#7BC8A4" />
            <a-box position="-1 -0.1 -90.5" width="2" depth="2" height="0.1" color="#7BC8A4" />
        </a-scene>
        </body>
        </html>)
  }
}

export default LocationsVRScene