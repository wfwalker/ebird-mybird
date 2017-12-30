var React = require('react');

import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

var moment = require('moment')

class Family extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  latinNameFromEbirdFamily(inString) {
    return inString.replace(/(.*)\((.*)\)/, '$1')
  }

  render() {
    return (
      <DefaultLayout title={this.commonNameFromEbirdFamily(this.props.name)} subtitle={this.latinNameFromEbirdFamily(this.props.name)}>
        <PageHeading title={this.commonNameFromEbirdFamily(this.props.name)} subtitle={this.latinNameFromEbirdFamily(this.props.name)} />

        {this.generateThumbnails()}

        {this.generateSpeciesList(this.props.sightingList)}

        {this.generateDatesandMapRow(this.props.sightingList)}
      </DefaultLayout>
    )
  }
}

export default Family
