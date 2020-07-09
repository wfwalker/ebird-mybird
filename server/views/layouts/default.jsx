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

        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" crossorigin="anonymous"></link>

        <script src="https://code.jquery.com/jquery-3.4.1.min.js" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" crossorigin="anonymous"></script>

        <script type='text/javascript' src='/scripts/jquery.justifiedGallery.min.js'></script>
        <script type='text/javascript' src="https://www.googletagmanager.com/gtag/js?id=UA-717974-5"></script>
        <script type='text/javascript' src='/scripts/my-gtag.js'></script>
        <script type='text/javascript' src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-3-typeahead/4.0.2/bootstrap3-typeahead.min.js" crossorigin="anonymous"></script>
        <script type='text/javascript' src='/scripts/app.js'></script>

      </head>
    )
  }

  generateNav() {
    return (
      <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/photos">BirdWalker</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className='nav-item'><a className='nav-link' data-hash="photos" href="/photos">Photos</a></li>
            <li className='nav-item'><a className='nav-link' data-hash="videos" href="/videos">Videos</a></li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Birding</a>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="/bigdays">Big Days</a>
                <a className="dropdown-item" href="/locations">Locations</a>
                <a className="dropdown-item" href="/trips">Trips</a>
                <a className="dropdown-item" href="/chrono">Chronological Life List</a>
                <a className="dropdown-item" href="/taxons">Taxonomic Life List</a>
              </div>
            </li>

            <form action='/search' method='GET' className="pl-5-lg form-inline" role="search">
              <div className="form-group">
                <input id='searchtext' name='searchtext' data-provide="typeahead" type="text" className="typeahead form-control" placeholder="Search" />
              </div>
              <button id='gosearch' type="submit" className="btn btn-outline-secondary">Submit</button>
            </form>
          </ul>
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

          <div className="container" style={{paddingTop: '90px'}}>
            {this.props.children}
          </div>

          <footer>
            <div className="container" style={{paddingTop: '60px'}}>
              For more info, please contact <a className='black' href="mailto:wfwalkerphoto@gmail.com">wfwalkerphoto@gmail.com</a>
            </div>
          </footer>
        </body>
      </html>
    )
  }
}
 
export default DefaultLayout
