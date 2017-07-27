var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import { TripLink } from './utilities.jsx'
import PageHeading from './pageheading.jsx'
var moment = require('moment')

class ChronoLifeList extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateFirstSightingLink(fs) {
    return (
      <div key={fs['Common Name']}>
        <a href={'/taxon/' + fs['Common Name']}>{fs['Common Name']}</a>
      </div>
    )
  }

  generateChronoEntriesForDate(dateTuple) {
    let dateSightings = this.props.firstSightingList.filter(s => (s['Date'] === dateTuple.date))

    return (
      <tr key={dateTuple.date} valign='top'>
        <td><TripLink tuple={dateTuple} /></td>
        <td>{dateSightings.map(ds => this.generateFirstSightingLink(ds))}</td>
      </tr>
    )
  }

  render() {
    return (
      <DefaultLayout title='Our Life List' subtitle={this.props.firstSightingList.length() + ' species'}>
        <PageHeading title='Our Life List' subtitle={this.props.firstSightingList.length() + ' species'} />

        <table className='table table-condensed table-striped'>
          <tbody>
            {this.props.firstSightingList.getDateTuples().map(dt => this.generateChronoEntriesForDate(dt))}
          </tbody>
        </table>
      </DefaultLayout>
    )
  }
}

export default ChronoLifeList