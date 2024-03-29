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
      <div className='col-md-4'>
        <div style={{fontWeight: 'bold', paddingTop: '2em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
          <a href={'/family/' + familyName}>{this.commonNameFromEbirdFamily(familyName)}</a>
        </div>
        <a href={'/family/' + familyName}>
          <img alt={this.commonNameFromEbirdFamily(familyName)} src={randomImage['Photo URL']}  className='img-fluid'/>
        </a>
      </div>
    )
  }

  render() {
    let familyNames = Object.keys(this.props.hierarchy)

    return(
      <DefaultLayout title='Photos'>
        <div className='row'>
          <div className='col-md-8'>
            <PageHeading title='Welcome to BirdWalker'/ >
            <p className='lead'>Birding photos and trip reports by Bill Walker and Mary Wisnewski, California birders based in Santa Clara County. We've been collecting our trip reports since 1996.</p>

            <p className='lead'>Some of our favorite places to go birding include
              {' '} <a className='black' href='/place/US-CA/Santa Clara/Charleston Slough'>Charleston Slough</a> and
              {' '} <a className='black' href='/place/US-CA/Santa Clara/Palo Alto Duck Pond'>the Duck Pond</a> in Palo Alto,
              {' '} <a className='black' href='/place/US-CA/Glenn'>Sacramento National Wildlife Refuge</a>, and
              {' '} <a className='black' href='/place/US-TX/Hidalgo'>the Rio Grande Valley</a> in Texas.
            </p>

            <p className='lead'>
              You can also see these sightings at <a target='_blank' href='https://ebird.org/profile/Mjk5MjQ/world'>Bill's eBird profile</a>.
            </p>
          </div>
          <div className='col-md-4'>
            <PageHeading href={'/photos/dayofyear/' + this.props.currentDayOfYear} title={'Photos from ' + this.props.startDayOfYear + ' - ' + this.props.endDayOfYear} />
            <a href={'/photos/dayofyear/' + this.props.currentDayOfYear}><img className='img-fluid' src={this.props.photosThisWeek[0]['Photo URL']} /></a>
          </div>
        </div>

        <div className='row'>
          <div className='col'>
            <PageHeading title={this.props.numSpecies + ' species photographed'} />
          </div>
        </div>
        <div className='row'>
            {familyNames.map(familyName => this.generateImageForFamily(familyName, this.props.photosByFamily[familyName]))}
        </div>

      </DefaultLayout>
    )
  }
}

export default Photos
