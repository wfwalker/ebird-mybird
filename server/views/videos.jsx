var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

class Videos extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <DefaultLayout title='Videos'>
        <div className='row'>
          <div className='col-md-8'>
            <PageHeading title='BirdWalker Videos'/ >
            <p className='lead'>Since 2017, I've started making video in addition to photos, in order to better capture bird behavior.</p>

            <iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PLKnXRX7bgaKol17Ppe58ZEIW3ag54Ulnz" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
            </iframe>
          </div>
        </div>
      </DefaultLayout>
    )
  }
}

export default Videos
