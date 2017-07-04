var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
var moment = require('moment')

class Photo extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

	render() {
		return (
			<DefaultLayout title={this.props['Common Name']}>
				<h3>{this.props['Common Name']} <span className='lighter'>{this.props['Scientific Name']}</span></h3>
				<div>{this.props.Location}, {moment(this.props.DateObject).format('MMMM, DD, YYYY')}</div>

				<img className='framed' src={this.props['Photo URL']} />
			</DefaultLayout>
		)
	}
}

export default Photo