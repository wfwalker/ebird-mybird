var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'

class Photos extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateImageForFamily(familyName, family) {
    let randomImage = family[0]
    return (
      <a href={'/family/' + familyName}>
        <img alt={this.commonNameFromEbirdFamily(familyName)} src={randomImage['Thumbnail URL']} />
      </a>
    )
  }

  render() {
    let familyNames = Object.keys(this.props.hierarchy)

    return(
      <DefaultLayout title=''>
        <div className='row'>
          <div className='col-md-8'>
            {this.generateHeading('Welcome to BirdWalker')}
            <p className='lead'>Birding photos and trip reports by Bill Walker and Mary Wisnewski, California birders based in Santa Clara County. We've been collecting our trip reports since 1996.</p>

            <p className='lead'>Some of our favorite places to go birding include
              <a href='/place/US-CA/Santa Clara/Charleston Slough'>Charleston Slough</a> and
              <a href='/place/US-CA/Santa Clara/Palo Alto Duck Pond'>the Duck Pond</a> in Palo Alto,
              <a href='/place/US-CA/Glenn'>Sacramento National Wildlife Refuge</a>, and
              <a href='/place/US-TX/Hidalgo'>the Rio Grande Valley</a> in Texas.
            </p>
          </div>
          <div className='col-md-4'>
            <h3><a href={'/photos/dayofyear/' + this.props.currentDayOfYear}>Photos from {this.props.startDayOfYear} - {this.props.endDayOfYear}</a></h3>
            <a href={'/photos/dayofyear/' + this.props.currentDayOfYear}><img className='img-responsive' src={this.props.photosThisWeek[0]['Photo URL']} /></a>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            {this.generateHeading(this.props.numSpecies + ' species photographed')}

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
