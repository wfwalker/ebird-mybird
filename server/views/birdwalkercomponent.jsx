var React = require('react');
var iso3166 = require('iso-3166-2')
var moment = require('moment')

class BirdwalkerComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  getCustomDayNameForDate(inDate) {
  	return this.props.customDayNames[moment(inDate).format('MM-DD-YYYY')]
  }


	lookupState(inString) {
		if (inString == null || inString === '') {
			return 'None'
		} else if (!iso3166.subdivision(inString).name) {
			return inString
		} else {
			return iso3166.subdivision(inString).name
		}
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