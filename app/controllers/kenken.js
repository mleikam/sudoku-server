// kenken controller
var cfg = require('../config')

var express = require(cfg.getModuleDir()+'express')
var router = express.Router()

var Puzzle = require('../models/kenkenModel')

var View = require('../views/view');
var view_callback = View.renderPuzzle;

// all & FIRST
router.get('*', function(req, res,next) {
	Puzzle.reset();
	next();
});

// random puzzle
router.get('/', function(req, res) {
	res.mode = 'random'
	next();
})

// by size and difficulty /k/4x4/6
router.get(/k\/([0-9]+)(x[0-9])\/([0-9])\/?$/, function(req, res, next) {
    Puzzle.setSize(req.params[0]);
    Puzzle.setDifficulty(req.params[2]);
    res.mode = 'size and difficulty'
    next();
})

// by size only /k/4x4/
router.get(/k\/([0-9]+)(x[0-9])\/?$/, function(req, res,next) {
    Puzzle.setSize(req.params[0]);
    res.mode = 'size'
    next();
})

// by difficulty
router.get(/k\/([0-9])\/?$/, function(req, res,next) {
    Puzzle.setDifficulty(req.params[0]);
    res.mode = 'difficulty'
    next();
})

// by puzzle ID /k/488
router.get(/k\/([0-9][0-9]+)\/?$/, function(req, res,next) {
    Puzzle.setID(req.params[0]);
    res.mode = 'id'
    next();
})

// all & LAST 
router.get('*', function(req, res) {
	View.setRes(res);
	Puzzle.get( view_callback );
});

module.exports = router
