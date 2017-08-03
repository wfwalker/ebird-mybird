
var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

class JPEGs extends BirdwalkerComponent {
  render() {
    return (
        <DefaultLayout title='JPEGs'>
          <PageHeading title='JPEGs' />

          <div><a target='_blank' href='http://ebird.org/ebird/downloadMyData'>DOWNLOAD MY DATA</a></div>

          <table className='table'>
          {this.props.jpegs.map(j => (
            <tr>
              <td>{j.label}</td>
              <td>{j.name}</td>
              <td><a target='_blank' href={'/trip/' + j.ebirdDate}>{j.ebirdDate}</a>  </td>
              <td>{j.action}</td>
            </tr>
          ))}
          </table>
        </DefaultLayout>
    )
  }
}

export default JPEGs