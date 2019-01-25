var React = require('react');
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
import PageCountedSubheading from './pagecountedsubheading.jsx'
import { TaxonLink } from './utilities.jsx'
var moment = require('moment')

class SearchResults extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DefaultLayout title={'Search Results "' + this.props.searchtext + '"'}>
        <PageHeading title={'Search Results "' + this.props.searchtext + '"'} />

        {this.generateThumbnails()}

        <PageCountedSubheading count={this.props.sightingList.getUniqueValues('Common Name').length} noun='Species' />

        <div className='biglist'>
          {this.props.sightingList.getUniqueValues('Common Name').map(cn => <TaxonLink commonName={cn} />)}
        </div>

        {this.generateDatesandMapRow(this.props.sightingList)}

      </DefaultLayout>
    )
  }
}

export default SearchResults
