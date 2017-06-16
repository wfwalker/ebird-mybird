var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
var moment = require('moment')

class County extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateThumbnails() {
		return (
	    <div className='mygallery'>
	    	{this.props.photos.map(p => (<a href={'/photo/' + p.id}><img alt={p['Common Name']} src={p['Photo URL']} /></a>))}
	    </div>
		)  	
  }

  generateLinkForCommonName(cn) {
  	return (
	    <div key={cn} className='biglist-item'><a href={'/taxon/' + cn}>{cn}</a></div>
		)
  }

  generateSpeciesList(commonNames) {
  	return (
	    <div className='biglist'>
		    {commonNames.map(cn => this.generateLinkForCommonName(cn))}
	    </div>
		)
  }

  render() {
  	const commonNames = this.props.sightingList.getUniqueValues('Common Name')
  	return (
			<DefaultLayout title={this.props.title}>
				{this.generateHeading(this.props.name + ' County', 'TODO link' + this.lookupState(this.props.State))}

				{this.generateThumbnails()}

				<h4>{commonNames.length} Species</h4>

				{this.generateSpeciesList(commonNames)}
			</DefaultLayout>
		)
  }
}

/*
<h3>{{name}} County <span class='lighter'><a href='/place/{{State}}'>{{lookupState State}}</a>, {{Country}}</span></h3>

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

export default County