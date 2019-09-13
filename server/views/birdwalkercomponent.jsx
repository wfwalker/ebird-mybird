var React = require('react');
var iso3166 = require('iso-3166-2')
import LocationMap from './locationmap.jsx'
import LocationsVRScene from './locationsvrscene.jsx'
import { LinkToFamily, Thumbnail, TripLink, TaxonLink, MonthGraph } from './utilities.jsx'
import PageCountedSubheading from './pagecountedsubheading.jsx'

class BirdwalkerComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  commonNameFromEbirdFamily(inString) {
    return inString.replace(/(.*)\((.*)\)/, '$2')
  }

  generateLinkToLocation(state, county, location) {
    // TODO: move this elsewhere?
    if ((county == '') || (county == null)) {
      county = 'none'
    }

    return (
      <div key={location} className='biglist-item'><a href={'/place/' + state + '/' + county + '/' + location}>{location}</a></div>
    )
  }

  generateSpeciesList(sightingList, allowHierarchy = true) {
    const commonNames = sightingList.getUniqueValues('Common Name')
    const hierarchy = this.props.sightingList.getTaxonomyHierarchy()

    if ((commonNames.length < 20) || (! allowHierarchy)) {
      return (
        <div>
          <PageCountedSubheading count={commonNames.length} noun='Species' />
          <div className='biglist'>
            {commonNames.map(cn => <TaxonLink commonName={cn} />)}
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <PageCountedSubheading count={commonNames.length} noun='Species' />
          <div className='biglist'>
            {Object.keys(hierarchy).map(f => (
              <div>
                <LinkToFamily family={f} />
                {hierarchy[f].map(cn => <TaxonLink commonName={cn} />)}
              </div>))
            }
          </div>
        </div>
      )
    }
  }

  generateThumbnails() {
		return (
	    <div className='mygallery'>
        {this.props.photos.map(p => (<Thumbnail key={p.id} photo={p} />))}
	    </div>
		)  	
  }

  generateGoogleMap(inData) {
    let locationTriples = inData.getLocationTriples()

    return (
      <div>
        <LocationMap data={inData} />
        {(locationTriples.length < 20) && locationTriples.map(l => this.generateLinkToLocation(l[0], l[1], l[2]))}
      </div>
    )
  }

  generateLocationsVRScene(inData) {
    let locationTriples = inData.getLocationTriples()

    return (
      <LocationsVRScene data={inData} />
    )
  }

  generateDateList(sightingList) {
  	if (sightingList.getUniqueValues('Date').length < 30) {
      const listDateTuples = sightingList.getDateTuples()
	  	return (
					<div className="biglist">
						{listDateTuples.map(tuple => <TripLink tuple={tuple} />)}
					</div>
			)
  	} else {
	  	return (
					<div id={this.props.chartID} class='bargraph'>
						<MonthGraph byMonth={this.props.sightingList.byMonth()} />
					</div>
			)
	  }
	}

  generateDatesandMapRow(sightingList) {
    const listDateTuples = sightingList.getDateTuples()
    const listLocations = sightingList.getUniqueValues('Location')

    return (
      <div>
        <div className='row'>
          <div className='col-md-12'>
            <PageCountedSubheading count={listDateTuples.length} noun='Date' />          
            {this.generateDateList(sightingList)}
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <PageCountedSubheading count={listLocations.length} noun='Location' />          
            {this.generateGoogleMap(sightingList)}
          </div>
        </div>
      </div>
    )
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
}

export default BirdwalkerComponent
