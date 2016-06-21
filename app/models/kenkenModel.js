// model component

//////////
// MAIN

var db = require('./db');
var cfg = require('../config');

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
        createSudokuQuery();
    }
}

function createSudokuQuery(){
    // not implemented
}

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

