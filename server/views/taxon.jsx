var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

var moment = require('moment')

class Taxon extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DefaultLayout title='Sighting' subtitle={this.props.scientificName}>
        <PageHeading title={this.props.name} subtitle={this.props.scientificName} />

        {this.generateThumbnails()}

        {this.generateDatesandMapRow(this.props.sightingList)}

      </DefaultLayout>
    )
  }
}

export default Taxon