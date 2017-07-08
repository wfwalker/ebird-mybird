var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

class Location extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const locationDates = this.props.sightingList.getUniqueValues('Date')
    const commonNames = this.props.sightingList.getUniqueValues('Common Name')

    return (
      <DefaultLayout title={this.props.name}>
        <PageHeading title={this.props.sightingList.rows[0].Location} subtitle={this.lookupState(this.props.sightingList.rows[0]['State/Province'])} />

        {this.props.locationInfo[0] && (<a target='_blank' href={'http://ebird.org/ebird/hotspot/' + this.props.locationInfo[0].locID}>eBird Hotspot</a>)}

        {this.generateThumbnails()}

        <h4>{commonNames.length} Species</h4>

        {this.generateSpeciesList(commonNames)}

        {this.generateDatesandMapRow(this.props.sightingList)}

      </DefaultLayout>
    )
  }
}

export default Location