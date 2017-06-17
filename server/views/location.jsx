var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'

class Location extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateLocationHeading() {
  	return (
  		<div>
  			{this.generateHeading(this.props.sightingList.rows[0].Location, this.lookupState(this.props.sightingList.rows[0]['State/Province']))}
  		</div>
		)
  }

  render() {
    const locationDates = this.props.sightingList.getUniqueValues('Date')
  	const commonNames = this.props.sightingList.getUniqueValues('Common Name')

  	return (
			<DefaultLayout title={this.props.name}>
				{this.generateLocationHeading()}

				{this.generateThumbnails()}

				<h4>{commonNames.length} Species</h4>

				{this.generateSpeciesList(commonNames)}

				<div className='row'>
					<div className='col-md-4'>
						<h4>{locationDates.length} Dates</h4>
						{this.generateDateList()}
					</div>
					<div className='col-md-8'>
						<h4>1 Location</h4>
						{this.generateGoogleMap(this.props.sightingList)}
					</div>
				</div>

			</DefaultLayout>
		)
  }
}

/*

{{> head title=name }}

<h3>
	{{sightingList.rows.0.Location}}
	<span class='lighter'>
		{{#if sightingList.rows.0.County}}
			<a href="/place/{{sightingList.rows.0.[State/Province]}}/{{sightingList.rows.0.County}}">{{sightingList.rows.0.County}} County</a>,
		{{/if}}
		{{lookupState sightingList.rows.0.[State/Province]}},
		{{sightingList.rows.0.[Country]}}
	</span>

	<span style='float: right'>
		<div class="dropdown">
			<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
				See also
				<span class="caret"></span>
			</button>
			<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
				<li><a target="_blank" href="https://www.openstreetmap.org/?mlat={{sightingList.rows.0.Latitude}}&mlon={{sightingList.rows.0.Longitude}}#map=10/{{sightingList.rows.0.Latitude}}/{{sightingList.rows.0.Longitude}}">OpenStreetMap</a></li>
				<li><a target="_blank" href="http://forecast.io/#/f/{{sightingList.rows.0.Latitude}},{{sightingList.rows.0.Longitude}}">Forecase.io Weather</a></li>
			</ul>
		</div>
	</span>
</h3>

{{> thumbnails}}

<h4>{{valuecount sightingList "Common Name"}} Species</h4>

{{> specieslist}}

<div class='row'>
	<div class='col-md-4'>
		{{> datelist}}
	</div>

	<div class='col-md-8'>

		<h4>{{valuecount sightingList "Location"}} Locations</h4>

		<div>
			{{googlemap sightingList mapID}}
		</div>

	</div>
</div>

*/


export default Location