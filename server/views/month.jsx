var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

var moment = require('moment')

class Month extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const yearDates = this.props.sightingList.getUniqueValues('Date')
    const locationNames = this.props.sightingList.getUniqueValues('Location')
    const tempMoment = moment().year(this.props.year).month(this.props.month - 1).day(1)  
    console.log('moment temp ' , tempMoment)
    return (
      <DefaultLayout title={tempMoment.format('MMMM, Y')}>
        <PageHeading title={tempMoment.format('MMMM, Y')} />

        {this.generateThumbnails()}

        <h4>{commonNames.length} Species</h4>

        {this.generateSpeciesList(this.props.sightingList)}

        {this.generateDatesandMapRow(this.props.sightingList)}
      </DefaultLayout>
    )
  }
}

export default Month