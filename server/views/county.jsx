var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
var moment = require('moment')

class County extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const countyDates = this.props.sightingList.getUniqueValues('Date')
    const commonNames = this.props.sightingList.getUniqueValues('Common Name')
    const locationNames = this.props.sightingList.getUniqueValues('Location')
    return (
      <DefaultLayout title={this.props.name + ' County'} subtitle={'TODO link' + this.lookupState(this.props.State) + ' ' + this.props.Country}>
        <PageHeading title={this.props.name + ' County'} subtitle={'TODO link' + this.lookupState(this.props.State) + ' ' + this.props.Country} />

        {this.generateThumbnails()}

        <h4>{commonNames.length} Species</h4>

        {this.generateSpeciesList(commonNames)}

        {this.generateDatesandMapRow(this.props.sightingList)}
      </DefaultLayout>
    )
  }
}

export default County