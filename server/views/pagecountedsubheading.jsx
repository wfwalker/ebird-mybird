var React = require('react');

class PageCountedSubheading extends React.Component {
  render() {
	if (this.props.count > 1) {
		return (
			<div className="mt-4 mb-4 lead">{this.props.count} {this.props.noun}{this.props.count > 1 && (! this.props.noun.endsWith('s')) && 's'}</div>
		)
	} else {
		return (
			<div className="mt-4 mb-4 lead"></div>
		)
	}	
  }
}

export default PageCountedSubheading
