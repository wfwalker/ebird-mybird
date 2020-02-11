
var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
import { LinkToFamily } from './utilities.jsx'

var moment = require('moment')

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