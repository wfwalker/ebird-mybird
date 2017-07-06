var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
var moment = require('moment')

class SearchResults extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  getLocations(inList) {
    let triples = []
    let tmp = []

    for (let index = 0; index < inList.rows.length; index++) {
      let row = inList.rows[index]
      let triple = [row['State/Province'], row['County'], row['Location']]
      let code = triple.join('-')

      if (tmp.indexOf(code) === -1) {
        triples.push(triple)
        tmp.push(code)
      }
    }

    return triples
  }

  render() {
    return (
      <DefaultLayout title={'Search Results "' + this.props.searchtext + '"'}>
        <PageHeading title={'Search Results "' + this.props.searchtext + '"'} />

        <h4>{this.props.dates.length} Dates</h4>

        <div className='biglist'>
          {this.props.dates.map(d => this.generateTripLink(d))}
        </div>

        <h4>{this.props.sightingList.getUniqueValues('Location').length} Locations</h4>

        <div className='biglist'>
          {this.getLocations(this.props.sightingList).map(l => this.generateLinkToLocation(l[0], l[1], l[2]))}
        </div>

        <h4>{this.props.sightingList.getUniqueValues('Common Name').length} Species</h4>

        <div className='biglist'>
          {this.props.sightingList.getUniqueValues('Common Name').map(cn => this.generateLinkForCommonName(cn))}
        </div>

      </DefaultLayout>
    )
  }
}

export default SearchResults
