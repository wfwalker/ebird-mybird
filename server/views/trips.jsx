var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
import { TripLink } from './utilities.jsx'

var moment = require('moment')

class Trips extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateYearTripList(y, list) {
    return (
      <div>
        <h4 className='stickyHeader'><a href={'/time/' + y}>{y}</a></h4>
        <div className='biglist'>
          {list.map(t => (<TripLink tuple={t} />))}
        </div>
      </div>
    )
  }

  render() {
    let byDate = {};
    this.props.tuples.forEach(d => {
      const theYear = d.dateObject.getFullYear();
      if (! byDate[theYear]) {
        byDate[theYear] = [];
      }
      byDate[theYear].push(d)
    })

    return (
      <DefaultLayout title='Trips'>
        <PageHeading title={this.props.tuples.length + ' trips'} />

        {Object.keys(byDate).reverse().map(y => (this.generateYearTripList(y, byDate[y])))}

      </DefaultLayout>
    )
  }
}

export default Trips
