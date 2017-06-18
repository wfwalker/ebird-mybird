var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
var moment = require('moment')

class Taxon extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DefaultLayout title='Sighting'>
        {this.generateHeading(this.props.name, this.props.scientificName)}

        {this.generateThumbnails()}

        {this.generateDatesandMapRow(this.props.sightingList)}

      </DefaultLayout>
    )
  }
}

/*
<h3>
  {{name}} <span class='lighter'>{{scientificName}}</span>

  <span style='float: right'>
    <div class="dropdown">
      <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        See also
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
        <li><a target="_blank" href="http://www.xeno-canto.org/species/{{spacetodash scientificName}}">xeno-canto</a></li>
        <li><a target="_blank" href="http://en.wikipedia.org/wiki/{{spacetounder name}}">wikipedia</a></li>
      </ul>
    </div>
  </span>

</h3>

{{> thumbnails}}

<div class='row'>
  <div class='col-md-6'>
    {{> datelist}}
  </div>

  <div class='col-md-6'>
    <h4>{{valuecount sightingList "Location"}} Locations</h4>
    {{googlemap sightingList mapID}}    
  </div>
</div>

{{> foot}}

*/

export default Taxon