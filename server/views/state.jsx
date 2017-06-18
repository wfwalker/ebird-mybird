
var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
var moment = require('moment')

class State extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const commonNames = this.props.sightingList.getUniqueValues('Common Name')

    return (
      <DefaultLayout title={this.props.title}>
        {this.generateHeading(this.lookupState(this.props.State), this.props.Country)}

        {this.generateThumbnails()}

        <h4>{commonNames.length} Species</h4>

        {this.generateSpeciesList(commonNames)}

        {this.generateDatesandMapRow(this.props.sightingList)}
      </DefaultLayout>
    )
  }
}

export default State
