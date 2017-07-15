var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
var moment = require('moment')

class Trip extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateLinkForSubmssionID(id) {
    let sighting = this.props.submissionIDToSighting[id]

    // TODO duplicated code!!
    let county = sighting['County']
    if (county == '') {
      county = 'none'
    }

    return (
      <div className='biglist-item'>
          <a href={'/place/' + sighting['State/Province'] + '/' + county + '/' + sighting['Location']}>{sighting['Location']}</a>
          <a href={'http://ebird.org/ebird/view/checklist?subID=' + id}><img src='/images/ebird-favicon.png' /></a>

          <div style={{fontSize: '80%', marginLeft: '1em'}}>
            {sighting['Protocol']}, {sighting['Duration (Min)']}mins, {sighting['Time']}
            {sighting['Checklist Comments']}
          </div>
      </div>
    )
  }

  render() {
    const locations = this.props.sightingList.getUniqueValues('Location')
    const commonNames = this.props.sightingList.getUniqueValues('Common Name')
    const submissionIDs = this.props.sightingList.getUniqueValues('Submission ID')

    return (
      <DefaultLayout title={moment(this.props.tripDate).format('MMM DD, YYYY')} subtitle={this.props.customName} >
        <PageHeading title={moment(this.props.tripDate).format('dddd, MMM DD, YYYY')} subtitle={this.props.customName} />

        {this.generateThumbnails()}

        <h4>{submissionIDs.length} eBird checklists</h4>

        <div className='biglist'>
          {submissionIDs.map(id => this.generateLinkForSubmssionID(id))}
        </div>

        <h4>{commonNames.length} Species</h4>

        {this.generateSpeciesList(commonNames)}

        <h4>{locations.length} Locations</h4>
        {this.generateGoogleMap(this.props.sightingList)}

      </DefaultLayout>
    )
  }
}

export default Trip
