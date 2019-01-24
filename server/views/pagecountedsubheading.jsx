var React = require('react');

class PageCountedSubheading extends React.Component {
  render() {
	return (
		<h4>
			<span>{this.props.count} {this.props.noun}{this.props.count > 1 && (! this.props.noun.endsWith('s')) && 's'}</span>
		</h4>)
  }
}

export default PageCountedSubheading
