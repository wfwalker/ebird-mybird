var React = require('react')
import DefaultLayout from './layouts/default.jsx'
import BirdwalkerComponent from './birdwalkercomponent.jsx'

class Locations extends BirdwalkerComponent {
  constructor(props) {
    super(props);
  }

  generateEntriesForState(state) {
  	return (
  		<div>
				<h3>{this.lookupState(state)}</h3>
				{Object.keys(this.props.hierarchy[state]).map(c => (
					<div key={c}>
						<h4>{c} County</h4>
						{this.props.hierarchy[state][c].map(l => (
							<div key={l} className='biglist-item'><a href={'/location/' + state + '/' + c + '/' + l}>{l}</a></div>
						))}
					</div>
				))}
			</div>
		)
  }

	render() {
		return (
			<DefaultLayout title={this.props.title}>
				{this.generateHeading(this.props.count + ' Locations')}

				<div className='biglist'>
					{Object.keys(this.props.hierarchy).map(h => (
						<div key={h}>
							{this.generateEntriesForState(h)}
						</div>
					))}
				</div>
			</DefaultLayout>
		)
	}
}

export default Locations;