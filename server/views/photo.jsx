var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
var moment = require('moment')

class Photo extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

	render() {
		return (
			<DefaultLayout title={this.props['Common Name']}>
				<PageHeading title={this.props['Common Name']} subtitle={this.props['Scientific Name']} />
				<div>{this.props.Location}, {moment(this.props.DateObject).format('MMMM, DD, YYYY')}</div>

				<img className='framed' src={this.props['Photo URL']} />
			</DefaultLayout>
		)
	}
}

export default Photo