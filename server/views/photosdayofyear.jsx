var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'

class PhotosThisWeek extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DefaultLayout title='Photos'>
        {this.generateHeading('Photos from ' + this.props.startDayOfYear + ' - ' + this.props.endDayOfYear)}
        {this.generateThumbnails()}
      </DefaultLayout>
    )
  }
}

export default PhotosThisWeek