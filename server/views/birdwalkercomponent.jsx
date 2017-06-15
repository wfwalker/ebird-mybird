var React, { Component } = require('react');
var DefaultLayout = require('./layouts/default');

class BirdwalkerComponent extends Component {
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
}

export default BirdwalkerComponent