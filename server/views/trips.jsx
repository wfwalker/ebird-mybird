var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

var moment = require('moment')

class Trips extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateTrips(list) {
    return list.map(t => this.generateTripLink(t))
  }

  generateYearTripList(y, list) {
    return (
      <div>
        <h4 className='stickyHeader'><a href={'/year/' + y}>{y}</a></h4>
        <div className='biglist'>
          {this.generateTrips(list)}
        </div>
      </div>
    )
  }

  render() {
    let byDate = {};
    this.props.trips.forEach(d => {
      const theYear = d.getFullYear();
      if (! byDate[theYear]) {
        byDate[theYear] = [];
      }
      byDate[theYear].push(d)
    })

    return (
      <DefaultLayout title='Trips'>
        <PageHeading title={this.props.trips.length + ' trips'} />

        {Object.keys(byDate).reverse().map(y => (this.generateYearTripList(y, byDate[y])))}

      </DefaultLayout>
    )
  }
}

export default Trips
