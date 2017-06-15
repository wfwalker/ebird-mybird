var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
var moment = require('moment')

class Trips extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateTrip(t) {
  	return (
			<div className='biglist-item'>
				<a href={'/trip/' + moment(t).format('MM-DD-YYYY')}>{moment(t).format('MMM, DD, YYYY')}</a> {this.props.customDayNames[moment(t).format('MM-DD-YYYY')]}
			</div>
  	)
  }

  generateTrips() {
		return this.props.trips.map(t => this.generateTrip(t))
  }

	render() {
		return (
			<DefaultLayout title={this.props.title}>
				{this.generateHeading(this.props.trips.length + ' trips')}

				<div className='biglist'>
					{this.generateTrips()}
				</div>
			</DefaultLayout>
		)
	}
}

export default Trips
