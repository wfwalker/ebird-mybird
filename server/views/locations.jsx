var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'

class Locations extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateEntriesForCounty(state, county) {
    return (
      <div key={county}>
        <h4>{county} County</h4>
        {this.props.hierarchy[state][county].map(l => this.generateLinkToLocation(state, county, l))}
      </div>
    )
  }

  generateEntriesForState(state) {
    return (
      <div>
        <h3>{this.lookupState(state)}</h3>
        {Object.keys(this.props.hierarchy[state]).map(c => this.generateEntriesForCounty(state, c))}
      </div>
    )
  }

  render() {
    return (
      <DefaultLayout title={this.props.title}>
        {this.generateHeading(this.props.count + ' Locations')}

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