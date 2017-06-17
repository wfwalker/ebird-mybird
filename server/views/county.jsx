var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
var moment = require('moment')

class County extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const countyDates = this.props.sightingList.getUniqueValues('Date')
    const commonNames = this.props.sightingList.getUniqueValues('Common Name')
  	const locationNames = this.props.sightingList.getUniqueValues('Location')
  	return (
			<DefaultLayout title={this.props.title}>
				{this.generateHeading(this.props.name + ' County', 'TODO link' + this.lookupState(this.props.State) + ' ' + this.props.Country)}

				{this.generateThumbnails()}

				<h4>{commonNames.length} Species</h4>

				{this.generateSpeciesList(commonNames)}

				<div className='row'>
					<div className='col-md-4'>
						<h4>{countyDates.length} Dates</h4>
						{this.generateDateList()}
					</div>
					<div className='col-md-8'>
						<h4>{locationNames.length} Locations</h4>
						{this.generateGoogleMap(this.props.sightingList)}
					</div>
				</div>
			</DefaultLayout>
		)
  }
}

export default County