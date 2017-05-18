var winston = require('winston');

global.logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
		'timestamp': true,
		'level': 'debug'
      })
    ]
});
