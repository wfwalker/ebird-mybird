var React = require('react')
var DefaultLayout = require('./layouts/default')
var iso3166 = require('iso-3166-2')

function lookupState(inString) {
	logger.debug('lookupState', inString)
	if (inString == null || inString === '') {
		return 'None'
	} else if (!iso3166.subdivision(inString).name) {
		return inString
	} else {
		return iso3166.subdivision(inString).name
	}
}

class Locations extends React.Component {
  constructor(props) {
    super(props);
  }

	render() {
		return (
			<DefaultLayout title={this.props.title}>
				<h3>{this.props.count} Locations</h3>

				<div className='biglist'>
					{Object.keys(this.props.hierarchy).map(h => (
						<div key={h}>
							<h3>{lookupState(h)}</h3>
							{Object.keys(this.props.hierarchy[h]).map(c => (
								<div>
									<h4>{c} County</h4>
									{this.props.hierarchy[h][c].map(l => (
										<div className='biglist-item'><a href={'/location/' + h + '/' + c + '/' + l}>{l}</a></div>
									))}
								</div>
							))}
						</div>
					))}
				</div>
			</DefaultLayout>
		)
	}
}

export default Locations;