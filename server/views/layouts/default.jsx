var React = require('react');
 
var DefaultLayout = React.createClass({
  render: function() {
    return (
      <html>
        <head>
		    <meta charset="utf-8" />
		    <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes" />

		    <title>
		        BirdWalker | {this.props.title}
		    </title>

		    <meta name="description" content="ebird-mybird : An offline web app for browsing your personal eBird sightings" />

		    <link rel="shortcut icon" href="/images/ebird-favicon.ico" />
		    
		    <link rel="stylesheet" type="text/css" media="screen" href="/styles/app.css"></link>
		    <link rel="stylesheet" type="text/css" media="screen" href="/styles/justifiedGallery.min.css"></link>

		    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" crossorigin="anonymous" />

		    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" crossorigin="anonymous" />

		    <script src="https://code.jquery.com/jquery-3.1.1.min.js" crossorigin="anonymous"></script>    

		    <script src='/scripts/jquery.justifiedGallery.min.js'></script>

		    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" crossorigin="anonymous"></script>
		 
    	</head>
        <body>

		    <nav className="navbar navbar-default navbar-fixed-top">
		      <div className="container">
		        <div className="navbar-header">
		          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
		            <span className="sr-only">Toggle navigation</span>
		            <span className="icon-bar"></span>
		            <span className="icon-bar"></span>
		            <span className="icon-bar"></span>
		          </button>
		          <a className="navbar-brand" href="/photos">BirdWalker</a>
		        </div>
		        <div id="navbar" className="collapse navbar-collapse">
		          <ul className="nav navbar-nav">
		            <li><a data-hash="photos" href="/photos">Photos by Bill Walker</a></li>
		            <li className="dropdown">
		              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Birding <span className="caret"></span></a>
		              <ul className="dropdown-menu">
		                <li><a href="/bigdays">Big Days</a></li>
		                <li><a data-hash="locations" href="/locations">Locations</a></li>
		                <li><a href="/trips">Trips</a></li>
		                <li><a href="/chrono">Chronological Life List</a></li>
		                <li><a href="/taxons">Taxonomic Life List</a></li>
		              </ul>
		            </li>
		          </ul>

		          <form action='/search' method='GET' className="navbar-form navbar-left" role="search">
		            <div className="form-group">
		              <input id='searchtext' name='searchtext' type="text" className="form-control" placeholder="Search" />
		            </div>
		            <button id='gosearch' type="submit" className="btn btn-default">Submit</button>
		          </form>

		        </div>
		      </div>
		    </nav>

	        <div className="container" style={{paddingTop: '60px'}}>
        	{this.props.children}
        	</div>
        </body>
      </html>
    );
  }
});
 
module.exports = DefaultLayout;