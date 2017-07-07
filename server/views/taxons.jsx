
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
        <DefaultLayout title='Species'>
          <PageHeading title='Species' subtitle={this.props.scientificName} />
          <div className='biglist'>
            {Object.keys(this.props.hierarchy).map(f => (<LinkToFamily family={f} />))}
          </div>
        </DefaultLayout>
    )
  }
}

// {{> head title='Species'}}

// <h3>Our Life List <span class='lighter'>{{nicenumber lifeSightingsCount}} species</span></h3>

// <div class="biglist">
//  {{#each hierarchy}}
//    <div><a href='/family/{{@key}}'>{{stripLatinFromEbirdFamily @key}}</a></div>
//  {{/each}}
// </div>

// {{> foot}}


export default Taxons