var React = require('react');

class PageHeading extends React.Component {
  render() {
	return (
		<h3>
			{this.props.href ? (
				<a target={this.props.target} href={this.props.href}>{this.props.title}</a>
			) : (
				<span>{this.props.title}</span>
			)}

			{' '}

			{this.props.subtitle &&
			  <span className='lighter'>{this.props.subtitle}</span>
			}
		</h3>)
  }
}

export default PageHeading
