var React = require('react');

import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
import { LinkToFamily } from './utilities.jsx'

var moment = require('moment')

class County extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const countyDates = this.props.sightingList.getUniqueValues('Date')
    const locationNames = this.props.sightingList.getUniqueValues('Location')
    const hierarchy = this.props.sightingList.getTaxonomyHierarchy()

    return (
      <DefaultLayout title={this.props.name + ' County'} subtitle={this.lookupState(this.props.State) + ' ' + this.props.Country}>
        <PageHeading title={this.props.name + ' County'} subtitle={this.lookupState(this.props.State) + ' ' + this.props.Country} />

        {this.generateThumbnails()}

        {this.generateSpeciesList(this.props.sightingList)}

        {this.generateDatesandMapRow(this.props.sightingList)}
      </DefaultLayout>
    )
  }
}

export default County