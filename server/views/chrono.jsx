var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
var moment = require('moment')

class ChronoLifeList extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateFirstSightingLink(fs) {
  	return (
			<div key={fs['Common Name']} class='biglist-item'>
				{moment(fs.DateObject).format('MMM DD, YYYY')} <a href={'/taxon/' + fs['Common Name']}>{fs['Common Name']}</a>
			</div>
		)
  }

  render() {
  	return (
			<DefaultLayout title={this.props.title}>
				{this.generateHeading('Our Life List', this.props.firstSightings.length + ' species')}

				<div class="biglist">
					{this.props.firstSightings.map(fs => this.generateFirstSightingLink(fs))}
				</div>

			</DefaultLayout>
		)
  }
}

export default ChronoLifeList