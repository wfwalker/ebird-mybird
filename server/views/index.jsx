var React = require('react');
import DefaultLayout from './layouts/default.jsx'
 
var HelloMessage = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title}>
        <div>Hi There {this.props.name}</div>
      </DefaultLayout>
    );
  }
});
 
module.exports = HelloMessage;