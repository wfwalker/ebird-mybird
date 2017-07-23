var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

class PhotosThisWeek extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DefaultLayout title='Photos'>
        <PageHeading title={'Photos from ' + this.props.startDayOfYear + ' - ' + this.props.endDayOfYear} />

        {this.generateThumbnails()}

        {this.generateDatesandMapRow(this.props.sightingList)}
      </DefaultLayout>
    )
  }
}

export default PhotosThisWeek