// main entry point
var cfg = require('./config');

var express = require(cfg.getModuleDir()+"express");
var app     = express();
var db 		= require('./models/db')
var port 	= cfg.getWebServerPort();

// app.use('/birds', require('./controllers/birds') );
// app.use('/user', require('./controllers/user') );


// all & FIRST

var logger = function(req, res,next) {
	now = Date.now();
	console.log('App handling request at '+now);
	console.log('URL:', req.originalUrl );
	next();
}

var sudoku = require('./controllers/sudoku');
app.use('/',logger,sudoku);

// request error handler
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Bad, Bad Request');
});

// Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function(err) {
	if (err) {
		console.log('Unable to connect to database')
		process.exit(1)
	} else {
		app.listen( port , function() {
			console.log('Listening on port '+port )
		})
	}
})
