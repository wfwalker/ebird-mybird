var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
var moment = require('moment')

class BigDays extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateBigDayLink(bigDay) {
  	return (
			<div key={bigDay.date} class='biglist-item'>
				{bigDay.count} species,
				<a href={'/trip/' + bigDay.date}>
					{moment(bigDay.dateObject).format('MMM DD, YYYY')}: {this.getCustomDayNameForDate(bigDay.dateObject)}
				</a>
			</div>
		)
  }

  render() {
  	return (
			<DefaultLayout title='Big Days' >
				<PageHeading title='Big days' />

				<div>
					{this.props.bigDays.map(bd => this.generateBigDayLink(bd))}
				</div>

			</DefaultLayout>
		)
  }
}

export default BigDays