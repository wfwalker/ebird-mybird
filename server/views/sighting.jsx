var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
var moment = require('moment')

const gUsefulProperties = ['Submission ID', 'Common Name', 'Scientific Name', 'Taxonomic Order', 'Count', 'State/Province', 'County', 'Location', 'Longitude', 'Date', 'Time', 'Protocol', 'Duration (Min)', 'All Obs Reported', 'Country' ]

class Sighting extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const imageFilename = moment(this.DateObject).format('Y-MM-DD') + '-' + this.props['Scientific Name'].toLowerCase().replace(' ', '-') + '-NNNNNN.jpg'
    return (
      <DefaultLayout title='Sighting'>
      {this.generateHeading('Sighting')}

      { gUsefulProperties.map(p => (<div>{p}: {this.props[p]}</div>)) }

      <h4>JSON for photos.json</h4>

      <pre>
      "Date": "{this.props['Date']}",
      "Location": "{this.props['Location']}}",
      "Scientific Name": "{this.props['Scientific Name']}",
      "Common Name": "{this.props['Common Name']}",
      "Thumbnail URL": "https://s3.amazonaws.com/birdwalker/thumb/{imageFilename},
      "Photo URL": "https://s3.amazonaws.com/birdwalker/photo/{imageFilename},
      "County": "{this.props['County']}",
      "State/Province": "{this.props['State/Province']}"
      </pre>
      </DefaultLayout>
      )
  }
}

export default Sighting






