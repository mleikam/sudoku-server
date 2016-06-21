// user router

var cfg = require('../config')

var express = require(cfg.getModuleDir()+'express')

var router = express.Router();



// all & FIRST
router.get('*', function(req, res,next) {
	console.log('Request URL:', req.originalUrl);
	next();
});

// from http://expressjs.com/en/guide/using-middleware.html
router.get('/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next route
  console.log('id: '+req.params.id )
  if (req.params.id == 0) next('route');
  // otherwise pass the control to the next middleware function in this stack
  else next(); //
}, function (req, res, next) {
  // render a regular page
  console.log('regular')
  res.send('regular');
});

// handler for the /user/:id path, which renders a special page
router.get('/:id', function (req, res, next) {
	console.log('special')
  res.send('special');
});




module.exports = router;