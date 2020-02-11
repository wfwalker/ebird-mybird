var React = require('react');
var moment = require('moment')

import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'
import PageHeading from './pageheading.jsx'

class BigDay extends BirdwalkerComponent {
  render() {
    return (
      <div>
        {this.props.bigDay.count} species, {" "}
        <a className='black' href={'/trip/' + this.props.bigDay.date}>
          {moment(this.props.bigDay.dateObject).format('MMM DD, YYYY')}: {this.props.bigDay.customName}
        </a>
      </div>
    )
  }
}

class BigDays extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DefaultLayout title='Big Days' >
        <PageHeading title='Big days' />

        <div>
          {this.props.bigDays.map(bd => (<BigDay key={bd.date} bigDay={bd} />))}
        </div>

      </DefaultLayout>
    )
  }
}

export default BigDays