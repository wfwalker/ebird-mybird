var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

var moment = require('moment')

class Year extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const yearDates = this.props.sightingList.getUniqueValues('Date')
    const locationNames = this.props.sightingList.getUniqueValues('Location')
    return (
      <DefaultLayout title={this.props.year}>
        <PageHeading title={this.props.year} />

        {this.generateThumbnails()}

        {this.generateSpeciesList(this.props.sightingList)}

        {this.generateDatesandMapRow(this.props.sightingList)}
      </DefaultLayout>
    )
  }
}

export default Year