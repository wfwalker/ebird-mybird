var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
import { LinkToCounty, LinkToState } from './utilities.jsx'

class Location extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const locationDates = this.props.sightingList.getUniqueValues('Date')

    return (
      <DefaultLayout title={this.props.name}>
        <PageHeading title={this.props.name} subtitle={this.props.state} />

        <p>
          {this.props.county && (this.props.county != null) && (this.props.county != 'none') && (<LinkToCounty state={this.props.state} county={this.props.county} />)}
        </p>

        {this.props.locationInfo[0] && (<a target='_blank' href={'http://ebird.org/ebird/hotspot/' + this.props.locationInfo[0].locID}>eBird Hotspot</a>)}

        {this.generateThumbnails()}

        {this.generateSpeciesList(this.props.sightingList)}

        {this.generateDatesandMapRow(this.props.sightingList)}

      </DefaultLayout>
    )
  }
}

export default Location