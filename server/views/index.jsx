var React = require('react');
var DefaultLayout = require('./layouts/default');
 
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