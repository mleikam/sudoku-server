// kenken controller
var cfg = require('../config')

var express = require(cfg.getModuleDir()+'express')
var router = express.Router()

var Puzzle = require('../models/model')

var View = require('../views/view');
var view_callback = View.renderPuzzle;

// all & FIRST
router.get('*', function(req, res,next) {
	Puzzle.reset();
	console.log('start')
	next();
});

// Set model type
router.get(/^\/(k|s)\//, function(req, res,next) {
	console.log('param: '+req.params[0])
	Puzzle.setType(req.params[0]);
	res.mode = 'random'
	// next();
})

router.get(/7/, function(req, res,next) {
	console.log('b.7: ')
	// next();
});
router.get('6', function(req, res,next) {
	console.log('b.6: ')
	// next();
});

router.get('*', function(req, res,next) {
	console.log('done')
	res.send('done')
});


// random puzzle
// router.get('/', function(req, res, next) {
// 	res.mode = 'random'	
// 	next();
// })

// // by size and difficulty /k/4x4/6
// router.get(/^k|s\/([0-9]+)(x[0-9])\/([0-9])\/?$/, function(req, res, next) {
// 	console.log('c: '+req.params)
//     Puzzle.setSize(req.params[0]);
//     Puzzle.setDifficulty(req.params[2]);
//     res.mode = 'size and difficulty'
//     next();
// })

// // by size only /k/4x4/
// router.get(/^k|s\/([0-9]+)(x[0-9])\/?$/, function(req, res,next) {
// 	console.log('d: '+req.params)
//     Puzzle.setSize(req.params[0]);
//     res.mode = 'size'
//     next();
// })

// // by difficulty
// router.get(/^k|s\/([0-9])\/?$/, function(req, res,next) {
// 	console.log('e: '+req.params)
//     Puzzle.setDifficulty(req.params[0]);
//     res.mode = 'difficulty'
//     next();
// })

// // by puzzle ID /k/488
// router.get(/^k|s\/([0-9][0-9]+)\/?$/, function(req, res,next) {
// 	console.log('f: '+req.params)
//     Puzzle.setID(req.params[0]);
//     res.mode = 'id'
//     next();
// })

// // all & LAST 
// router.get('*', function(req, res) {
// 	View.setRes(res);
// 	Puzzle.get( view_callback );
// });

module.exports = router
