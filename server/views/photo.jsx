var React = require('react');
import DefaultLayout from './layouts/default.jsx'

class Photo extends React.Component {
  constructor(props) {
    super(props);
  }

	render() {
		return (
			<DefaultLayout title={this.props.title}>
				<h3>{this.props['Common Name']} <span className='lighter'>{this.props['Scientific Name']}</span></h3>
				<div>{this.props.Location}, {this.props.Date}</div>

				<img className='framed' src={this.props['Photo URL']} />
			</DefaultLayout>
		)
	}
}

export default Photo