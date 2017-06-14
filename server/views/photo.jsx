var React = require('react');
var DefaultLayout = require('./layouts/default');

var Photo = React.createClass({
	render: function() {
		return (
			<DefaultLayout title={this.props.title}>
				<h3>{this.props['Common Name']} <span className='lighter'>{this.props['Scientific Name']}</span></h3>
				<div>{this.props.Location}, {this.props.Date}</div>

				<img className='framed' src={this.props['Photo URL']} />
			</DefaultLayout>
		)
	}
})

module.exports = Photo;