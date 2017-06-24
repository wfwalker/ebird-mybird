
var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
var moment = require('moment')

class Family extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  latinNameFromEbirdFamily(inString) {
    return inString.replace(/(.*)\((.*)\)/, '$1')
  }

  render() {
    const commonNames = this.props.sightingList.getUniqueValues('Common Name')

    return (
      <DefaultLayout title={this.commonNameFromEbirdFamily(this.props.name)}>
        {this.generateHeading(this.commonNameFromEbirdFamily(this.props.name), this.latinNameFromEbirdFamily(this.props.name))}

        {this.generateThumbnails()}

        <h4>{commonNames.length} Species</h4>

        {this.generateSpeciesList(commonNames)}

        {this.generateDatesandMapRow(this.props.sightingList)}
      </DefaultLayout>
    )
  }
}

export default Family


/*
{{> head title=name}}

<h3>{{stripLatinFromEbirdFamily name}}</h3>

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

{{> foot}}

*/