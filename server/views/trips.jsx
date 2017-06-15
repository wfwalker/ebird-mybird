var React = require('react');
var DefaultLayout = require('./layouts/default');
var BirdwalkerComponent = require('./birdwalkercomponent');
var moment = require('moment')

class Trips extends React.Component {
  constructor(props) {
    super(props);
  }

	generateHeading(title, subtitle) {
		if (subtitle) {
			return (<h3>{title} <span className='lighter'>{subtitle}</span></h3>)
		} else {
			return (<h3>{title}</h3>)
		}
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
