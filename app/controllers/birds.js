// birds
var cfg = require('../config')

var express = require(cfg.getModuleDir()+'express')

var router = express.Router();

// all & FIRST
router.get(/(.*)/, function(req, res,next) {
	console.log('starting '+req.params[0])
	next();
});


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


// define the home page route
router.get('/', function(req, res) {
  res.send('Birds home page');
});

// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});


module.exports = router;