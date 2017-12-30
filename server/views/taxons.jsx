
var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

var moment = require('moment')

const LinkToFamily = (props) => {
  const englishPart = props.family.replace(/.*\((.*)\)/, '$1')
  return (
    <h3 className='biglist-item'><a href={'/family/' + props.family}>{englishPart}</a></h3>
  )
}

class Taxons extends BirdwalkerComponent {
  render() {
    return (
      <DefaultLayout title='Our Life List' subtitle={this.props.lifeSightingsCount + ' species'}>
        <PageHeading title='Our Life List' subtitle={this.props.lifeSightingsCount + ' taxons'} />
          {this.generateSpeciesList(this.props.sightingList)}
        </DefaultLayout>
    )
  }
}

export default Taxons