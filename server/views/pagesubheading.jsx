var React = require('react');

class PageSubheading extends React.Component {
  render() {
	return (
		<h4>
			{this.props.href ? (
				<a href={this.props.href}>{this.props.title}</a>
			) : (
				<span>{this.props.title}</span>
			)}

			{' '}

			{this.props.subtitle &&
			  <span className='lighter'>{this.props.subtitle}</span>
			}
		</h4>)
  }
}

export default PageSubheading
