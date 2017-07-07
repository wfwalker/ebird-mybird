var React = require('react');

class PageHeading extends React.Component {
  render() {
    if (this.props.subtitle) {
      return (<h3>{this.props.title} <span className='lighter'>{this.props.subtitle}</span></h3>)
    } else {
      return (<h3>{this.props.title}</h3>)
    }
  }
}

export default PageHeading