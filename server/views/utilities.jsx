var moment = require('moment')
var React = require('react');

const Thumbnail = (props) => {
  return (
    <a href={'/photo/' + props.photo.id}><img alt={props.photo['Common Name']} src={props.photo['Photo URL']} /></a>
  )
}

const TripLink = (props) => {
  return (
    <div className='biglist-item'>
      <a href={'/trip/' + moment(props.tuple.dateObject).format('MM-DD-YYYY')}>{moment(props.tuple.dateObject).format('MMM, DD, YYYY')}</a> {props.tuple.customDayName}
    </div>
  )
}

export { Thumbnail, TripLink }