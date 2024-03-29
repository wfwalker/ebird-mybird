var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
import PageSubheading from './pagesubheading.jsx'
import { LinkToCounty, LinkToState } from './utilities.jsx'

class Locations extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateEntriesForCounty(state, county) {
    return (
      <div key={county} className='biglist-group'>
        {county && (county != null) && (county != 'none') && (<LinkToCounty state={state} county={county} />)}
        {this.props.hierarchy[state][county].map(l => this.generateLinkToLocation(state, county, l))}
      </div>
    )
  }

  generateEntriesForState(state) {
    return (
      <div>
        <LinkToState state={state} title={this.lookupState(state)} />
        {Object.keys(this.props.hierarchy[state]).map(c => this.generateEntriesForCounty(state, c))}
      </div>
    )
  }

  render() {
    // TODO: need to accomodate country names!
    return (
      <DefaultLayout title='Locations'>
        <PageHeading title='Locations' />

        <div className='biglist'>
          {Object.keys(this.props.hierarchy).map(h => (
            <div key={h}>
              {this.generateEntriesForState(h)}
            </div>
          ))}
        </div>
      </DefaultLayout>
    )
  }
}

export default Locations;