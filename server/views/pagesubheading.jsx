var React = require('react');

class PageSubheading extends React.Component {
  render() {
	return (
		<div className="mt-4 mb-4 lead">
			{this.props.href ? (
				<a className='black' href={this.props.href}>{this.props.title}</a>
			) : (
				<span>{this.props.title}</span>
			)}

			{' '}

			{this.props.subtitle &&
			  <span className='lighter'>{this.props.subtitle}</span>
			}
		</div>)
  }
}

export default PageSubheading
