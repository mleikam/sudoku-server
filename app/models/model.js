// model component
// see https://qqwing.com/generate.html

//////////
// MAIN

var db = require('./db');
var cfg = require('../config');

var sudoku = require('./sudokuModel');

var Query = {sql:'',args:[]}

var type = cfg.TYPE_KENKEN;

var Puzzle = null; 

var request_params = {}

var status = 0; 


// main accessor
exports.get = function(callback){
    createQuery();
    loadPuzzle(callback);
    // return Puzzle; 
}


// PROGRESS /DEBUG 

var tracestack = []; 

function _trace(s){
    tracestack.push(s);
}

exports.getTrace = function(){
    var format = arguments[0] ? false : true; 
    if( format ){
        return tracestack.join("\n");

    } else {
        return tracestack;
    }
}

function setStatus(s){
    debug('status: '+s+"\n");
    status = s; 
}

function debug(s){
    console.log(s)
    _trace(s);
}


//////////////////////// 
// SETUP/CONFIG METHODS

exports.reset = function(){     // clear all parameters
    request_params = {
        size:null,
        difficulty:null,
        id:null
    }
    tracestack = [];
    debug('Puzzle reset')
}

// reset on load
exports.reset();

exports.setSize = function(size){
    if(size){
        request_params.size = size;
        debug('Set size '+size)
    }
}
exports.setDifficulty = function(diff){
    if(diff){
        request_params.difficulty = diff;
        debug('set difficulty '+diff)
    }
}
exports.setID = function(id){
    if(id){
        request_params.id = id; 
        debug('set ID '+id)
    }
}

exports.setType = function(t){
    debug('Set type to '+t)
    type = t;
}

/////////////////////////////////////////
/// QUERY METHODS

exports.getQuery = function(){
    return Query;
}

function createQuery(){
    if( type==cfg.TYPE_KENKEN ){
        createKenKenQuery();
    } else {
        // createSudokuQuery();
        sudoku.createQuery();
        Query.sql = sudoku.getSQL();
        Query.args = sudoku.getArgs();
    }
}

// moved to sudokuModel to allow for transformations
// function createSudokuQuery(){
//     // not implemented
//     // 
//     var sql = 'SELECT ? as puzzle_id,? as width, ? as height, ? as difficulty, ';
//     sql += '? as labels, ? as shapes, ? as answers';
//     var args = [];
//     args.push(0);   // puzzle id
//     args.push(9);   // width
//     args.push(9);   // height
//     args.push(3);   // difficulty
//     // labels
//     args.push('.....6.....5....6..3.9......5...9.1.7...3.89.8.9.1.5.6...1.79.....8....4.76.5...1');
//     // shapes
//     var a = 'a a a b b b c c c ', b = 'd d d e e e f f f ', c = 'g g g h h h i i i ';
//     args.push(a+a+a+b+b+b+c+c+c);
//     // answers
//     args.push('198526743425378169637941258253689417761435892849712536384167925512893674976254381');

//     Query.sql = sql;
//     Query.args = args;
//     // var combined = db.compileQuery(sql, args);
//     // console.log(combined)
// }

function createKenKenQuery(){
    var pre =  "SELECT * FROM puzzle";
    var q = pre;
    var args = [];
    if(request_params.id){
        q += " WHERE puzzle_id=? ";
        args.push(request_params.id);
    } else {
        q += " WHERE puzzle_id>0 ";
        if( request_params.difficulty ){
            q += " AND difficulty=? "
            args.push(request_params.difficulty)
        }
        if( request_params.size ){
            q += " AND width=? and height=? ";
            args.push(request_params.size, request_params.size);
        }
    }
    q += " ORDER BY RAND() LIMIT 1"
    debug('created sql: '+q)
    debug('created args: '+args)
    Query.sql = q;
    Query.args = args;
}

// helper to decide if we have an empty query
function QueryIsEmpty(){
    return Query.sql=='';
};

function _executeQuery(done){
    db.get().query(Query.sql,Query.args, 
    function (err, rows) {
        if (err){
            setStatus(cfg.DB_QUERY_ERROR);
            return done(err,null);
        }
        setStatus(cfg.DB_QUERY_SUCCESS);
        if(rows.length>0){
            rows[0].type = type;
            debug('Got puzzle '+rows[0].puzzle_id)
            done(null,rows[0]);
        } else {
            done(cfg.strings.NO_SUCH_PUZZLE,null)
        }
    })
}

function loadPuzzle(callback) {
    debug('Loading puzzle')
    Puzzle = null;
    // create a query if we don't have one
    if( QueryIsEmpty() ){
        createQuery();
    }
    // if its still blank, exit.  we don't know how to do the query
    if ( QueryIsEmpty() ){
        setStatus(cfg.NO_QUERY_ERROR);
        return; 
    }

    _executeQuery(callback);
}
//////////

