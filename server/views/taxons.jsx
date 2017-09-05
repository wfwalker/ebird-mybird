
var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

var moment = require('moment')

const LinkToFamily = (props) => {
  const englishPart = props.family.replace(/.*\((.*)\)/, '$1')
  return (
    <div className='biglist-item'><a href={'/family/' + props.family}>{englishPart}</a></div>
  )
}

class Taxons extends BirdwalkerComponent {
  render() {
    return (
      <DefaultLayout title='Our Life List' subtitle={this.props.lifeSightingsCount + ' species'}>
        <PageHeading title='Our Life List' subtitle={this.props.lifeSightingsCount + ' taxons'} />
          <div className='biglist'>
            {Object.keys(this.props.hierarchy).map(f => (<LinkToFamily family={f} />))}
          </div>
        </DefaultLayout>
    )
  }
}

export default Taxons