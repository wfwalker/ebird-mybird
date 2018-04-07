var React = require('react');
var moment = require('moment')

class DefaultLayout extends React.Component {
  constructor(props) {
    super(props);
    logger.debug('DefaultLayout constructor', this.props.title)
  }

  generateHead() {
    return (
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes" />

        <title>
            BirdWalker | {this.props.title}
        </title>

        <meta name="description" content="birdwalker.com: bird photos by Bill Walker" />

        <link rel="shortcut icon" href="/images/ebird-favicon.ico" />
        
        <link rel="stylesheet" type="text/css" media="screen" href="/styles/app.css"></link>
        <link rel="stylesheet" type="text/css" media="screen" href="/styles/justifiedGallery.min.css"></link>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" crossorigin="anonymous" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" crossorigin="anonymous" />

        <script type='text/javascript' src="https://code.jquery.com/jquery-3.1.1.min.js" crossorigin="anonymous"></script>    
        <script type='text/javascript' src='/scripts/jquery.justifiedGallery.min.js'></script>
        <script type='text/javascript' src="https://www.googletagmanager.com/gtag/js?id=UA-717974-5"></script>
        <script type='text/javascript' src='/scripts/my-gtag.js'></script>
        <script type='text/javascript' src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" crossorigin="anonymous"></script>
        <script type='text/javascript' src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-3-typeahead/4.0.2/bootstrap3-typeahead.min.js" crossorigin="anonymous"></script>
        <script type='text/javascript' src='/scripts/app.js'></script>

      </head>
    )
  }

  generateNav() {
    return (
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
              <li><a data-hash="photos" href="/photos">Photos</a></li>
              <li><a data-hash="videos" href="/videos">Videos</a></li>
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Birding <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li><a href="/bigdays">Big Days</a></li>
                  <li><a href="/locations">Locations</a></li>
                  <li><a href="/trips">Trips</a></li>
                  <li><a href="/chrono">Chronological Life List</a></li>
                  <li><a href="/taxons">Taxonomic Life List</a></li>
                </ul>
              </li>
            </ul>

            <form action='/search' method='GET' className="navbar-form navbar-left" role="search">
              <div className="form-group">
                <input id='searchtext' name='searchtext' data-provide="typeahead" type="text" className="typeahead form-control" placeholder="Search" />
              </div>
              <button id='gosearch' type="submit" className="btn btn-default">Submit</button>
            </form>

          </div>
        </div>
      </nav>
    )
  }

  render() {
    return (
      <html>
        {this.generateHead()}
        <body>
          {this.generateNav()}

          <div className="container" style={{paddingTop: '60px'}}>
            {this.props.children}
          </div>

          <footer>
          </footer>
        </body>
      </html>
    )
  }
}
 
export default DefaultLayout
