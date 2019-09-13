var React = require('react');

import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
import PageSubheading from './pagesubheading.jsx'
import PageCountedSubheading from './pagecountedsubheading.jsx'
import { LinkToFamily } from './utilities.jsx'

var moment = require('moment')

class Trip extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateLinkForSubmssionID(id) {
    let sighting = this.props.submissionIDToSighting[id]

    // with dynamicTyping in papaParse CVS parser, empty county name from eBird CSV is turned into actual null
    let county = sighting['County']
    if ((county == '') || (county == null)) {
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

  renderNotes(someTripNotes) {
    return (
      <div>
        <PageSubheading title='Notes' />
        <p dangerouslySetInnerHTML={{__html: someTripNotes}} />
      </div>) 
  }

  render() {
    const locations = this.props.sightingList.getUniqueValues('Location')
    const commonNames = this.props.sightingList.getUniqueValues('Common Name')
    const hierarchy = this.props.sightingList.getTaxonomyHierarchy()
    const submissionIDs = this.props.sightingList.getUniqueValues('Submission ID')

    return (
      <DefaultLayout title={moment(this.props.tripDate).format('MMM DD, YYYY')} subtitle={this.props.customName} >
        <PageHeading title={moment(this.props.tripDate).format('dddd, MMM DD, YYYY')} subtitle={this.props.customName} />

        {this.generateThumbnails()}

        <PageCountedSubheading count={submissionIDs.length} noun='eBird checklist' />

        <div className='biglist'>
          {submissionIDs.map(id => this.generateLinkForSubmssionID(id))}
        </div>

        {this.props.sightingList.rows[0].tripNotes && this.renderNotes(this.props.sightingList.rows[0].tripNotes)}

        {this.generateSpeciesList(this.props.sightingList)}

        <PageCountedSubheading count={locations.length} noun='Location' />
        {this.generateGoogleMap(this.props.sightingList)}

      </DefaultLayout>
    )
  }
}

export default Trip
