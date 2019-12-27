var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

class Photos extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  // TODO: important! revert randomImage['Photo URL'] to randomImage['Thumbnail URL']
  // after ensuring we have sufficiently hi-res thumbnails
  generateImageForFamily(familyName, family) {
    let randomImage = family[Math.floor(Math.random() * family.length)]

    return (
      <a href={'/family/' + familyName}>
        <img alt={this.commonNameFromEbirdFamily(familyName)} src={randomImage['Photo URL']} />
      </a>
    )
  }

  render() {
    let familyNames = Object.keys(this.props.hierarchy)

    return(
      <DefaultLayout title='Photos'>
        <div className='row'>
          <div className='col-md-4'>
            <PageHeading href={'https://www.cafepress.com/wfwalkerphoto.502632979'} title={'BirdWalker 2020 Wall Calendar'} />
            <p>
              My wall calendar of bird images from North and South America is available now from&nbsp;
              <a href='https://www.cafepress.com/wfwalkerphoto.502632979'>my online shop at cafepress.com</a>.
              Makes a great gift!
            </p>
            <a href='https://www.cafepress.com/wfwalkerphoto.502632979'>
              <img src='/images/bw2020-cover-thumb.jpg' />
            </a>
          </div>
          <div className='col-md-4'>
            <PageHeading title='Welcome to BirdWalker'/ >
            <p className='lead'>Birding photos and trip reports by Bill Walker and Mary Wisnewski, California birders based in Santa Clara County. We've been collecting our trip reports since 1996.</p>

            <p className='lead'>Some of our favorite places to go birding include
              {' '} <a href='/place/US-CA/Santa Clara/Charleston Slough'>Charleston Slough</a> and
              {' '} <a href='/place/US-CA/Santa Clara/Palo Alto Duck Pond'>the Duck Pond</a> in Palo Alto,
              {' '} <a href='/place/US-CA/Glenn'>Sacramento National Wildlife Refuge</a>, and
              {' '} <a href='/place/US-TX/Hidalgo'>the Rio Grande Valley</a> in Texas.
            </p>
          </div>
          <div className='col-md-4'>
            <PageHeading href={'/photos/dayofyear/' + this.props.currentDayOfYear} title={'Photos from ' + this.props.startDayOfYear + ' - ' + this.props.endDayOfYear} />
            <a href={'/photos/dayofyear/' + this.props.currentDayOfYear}><img className='img-responsive' src={this.props.photosThisWeek[0]['Photo URL']} /></a>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <PageHeading title={this.props.numSpecies + ' species photographed'} />

            <div className='mygallery'>
              {familyNames.map(familyName => this.generateImageForFamily(familyName, this.props.photosByFamily[familyName]))}
            </div>
          </div>
        </div>

      </DefaultLayout>
    )
  }
}

export default Photos
