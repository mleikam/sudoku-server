// sudoku controller

var cfg = require('../config')

var express = require(cfg.getModuleDir()+'express')

var router = express.Router();

var now = Date.now();

var Puzzle = require('../models/model')

var View = require('../views/view');
var view_callback = View.renderPuzzle;


// all & FIRST
router.get('*', function(req, res,next) {
	
	Puzzle.reset();
	res.mode = 'random'

	next();
});

/* one regex to rule them all
	/k				random puzzle by type
	/k/4x4/5 		type, size and difficulty
	/s/4x4/5
	/k/123 			type and ID
	/s/123
	/k/5x5			type and size
	/s/9x9
*/
router.get(/(k|s)\/?(([0-9]+)(x[0-9])?)?\/?([0-9])?\/?$/, 
	function(req, res, next) {
		// console.log('In regex ',req.params[0])
		var pp = [];
		for(i=0;i<5;i++){
			// console.log(i+': '+req.params[i])
			pp[i]= req.params[i];
		}
		parse(pp)
		next();
	}
);

function parse(pp){
	// if we have a first param (index 0), it is the type
	var type = _un(0) ? cfg.TYPE_KENKEN : pp[0];
	// we have a size if pp[3] exists
	var size = _un(3)===false ? pp[2] : null;
	// we have an ID iff the 3rd param is undefined, but second is not and second param is <10
	// if the second param is more than 10, it's a puzzle ID instead
	var id = null;
	var diff = _un(4) ? null : pp[4];
	if( _un(3) && (_un(2)===false) ){
		var x =  parseInt(pp[2]);
		if ( x>10 ){
			// console.log('assigning id to ',x)
			id = x; 
		} else {
			// console.log('assigned diff to ',x)
			diff = x; 
		}
	}

	// do the assignments
	Puzzle.setType(type);
	// View.setType(type);
	
	Puzzle.setSize(size);
	Puzzle.setDifficulty(diff);
	Puzzle.setID(id)

	// comparison helper functions
	function _un(i){ // index is undefined
		return pp[i]===undefined;
	}

	function isnull(x){	// isnull
		return typeof(x)===typeof(null);
	}
}


// for a different approach, perhaps more express-like, see
//  http://expressjs.com/en/guide/using-middleware.html
// // 3 parameter
// router.get('/:type/:size/:diff', function (req, res, next) {
// 	console.log('type: '+req.params.type)
// 	console.log('size: '+req.params.size)
// 	console.log('diff: '+req.params.diff)
// 	next();
// });

// // all & FIRST
// router.get('*', function(req, res,next) {
// 	//res.send('sudoku')
// });



// all & LAST 
router.get('*', function(req, res) {
	View.setRes(res);
	Puzzle.get( view_callback );
});


module.exports = router;