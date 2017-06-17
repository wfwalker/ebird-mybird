var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
var moment = require('moment')

class Trips extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateTrips() {
		return this.props.trips.map(t => this.generateTripLink(t))
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
