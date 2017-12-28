var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

class LocationsVR extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return this.generateLocationsVRScene(this.props.sightingList)
  }
}

export default LocationsVR