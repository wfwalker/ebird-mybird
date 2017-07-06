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
    return (
      <div className='biglist-item'>
          <a href={'/place/' + sighting['State/Province'] + '/' + sighting['County'] + '/' + sighting['Location']}>{sighting['Location']}</a>
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
        <PageHeading title={moment(this.props.tripDate).format('MMM DD, YYYY')} subtitle={this.props.customName} />

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



// {{#if (multiplevalues sightingList "Submission ID")}}
//   <h4>{{valuecount sightingList "Submission ID"}} eBird Checklists</h4>
// {{else}}
//   <h4>1 eBird Checklist</h4>
// {{/if}}

// <div class='biglist'>
//   {{#each (values sightingList "Submission ID")}}
//     <div class='biglist-item'>
//       {{#with (lookup ../submissionIDToSighting this)}}
//         <a href='/place/{{[State/Province]}}/{{addnone [County]}}/{{Location}}'>
//           {{[Location]}}
//         </a>
//       {{/with}}

//       <a target='_blank' href='http://ebird.org/ebird/view/checklist?subID={{this}}'>
//         <img src='/images/ebird-favicon.png' />
//       </a>

//       <div style='font-size: 80%; margin-left: 1em'>
//         {{#with (lookup ../submissionIDToSighting this)}}
//           <div>{{Protocol}}, {{[Duration (Min)]}}mins, {{[Time]}}</div>
//           <i>{{[Checklist Comments]}}</i>
//         {{/with}}
//       </div>

//     </div>
//   {{/each}}
// </div>

// <h4>
//   {{valuecount sightingList "Common Name"}} Species
// </h4>

// <div class="biglist">
//   {{#if (multiplevalues sightingList "Location")}}
//     {{#each (values sightingList "Common Name")}}
//       <div class='biglist-item'>
//         <a href='/taxon/{{encode this}}'>{{this}}</a>
//       </div>
//     {{/each}}
//   {{else}}
//     {{#each sightingList.rows}}
//       <div class='biglist-item'>
//         <a href="/sighting/{{this.id}}">+</a>
//         <a href='/taxon/{{encode [Common Name]}}'>{{[Common Name]}}</a>
//         {{#if (isnumber Count)}}
//           {{Count}}
//         {{/if}}
//       </div>
//       <span>
//         {{[Species Comments]}}
//       </span>
//     {{/each}}
//   {{/if}}
// </div>

// {{#if (multiplevalues sightingList "Location")}}
//   <h4>{{valuecount sightingList "Location"}} Locations</h4>
// {{else}}
//   <h4>
//     {{values sightingList "Location"}}
//   </h4>
// {{/if}}
