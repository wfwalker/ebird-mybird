var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'
import { LinkToFamily } from './utilities.jsx'

var moment = require('moment')

const humanReadableCategories = {
  'spuh': 'Genus-only ID',
  'slash': 'Species-pair ID',
  'species': 'Species',
  'issf': 'Group of Subspecies',
  'hybrid': 'Hybrid of two Species',
  'intergrade': 'Hybrid between two subspecies',
  'domestic': 'Distinctly-plumaged domesticated variety',
  'form': 'Miscellaneous other taxa'
}

const CategoryExplainer = (props) => {
  return (
    <div><span className='label label-primary'>{humanReadableCategories[props.category.toLowerCase()]}</span></div>
  )
}

class Taxon extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DefaultLayout title={this.props.name} subtitle={this.props.scientificName}>
        <PageHeading title={this.props.name} subtitle={this.props.scientificName} />

        <p><LinkToFamily family={this.props.family_name} /></p>

        {(this.props.category != 'species') && <CategoryExplainer category={this.props.category} />}

        {this.generateThumbnails()}

        {this.generateDatesandMapRow(this.props.sightingList)}

      </DefaultLayout>
    )
  }
}

export default Taxon