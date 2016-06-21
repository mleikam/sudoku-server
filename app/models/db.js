// db.js adapted from https://www.terlici.com/2015/08/13/mysql-node-express.html
// see also for example of server pools

var cfg = require('../config')
var mysql = require(cfg.getModuleDir()+'mysql')

var settings = cfg.getDB(); 

exports.MODE_TEST         = 'mode_test'
exports.MODE_PRODUCTION   = 'mode_production'

var state = {
  pool: null,
  mode: null,
}

exports.connect = function(mode, done) {
  console.log('Connecting to db with '+settings  )
  state.pool = mysql.createPool( settings )
  state.mode = mode
  done()
}

exports.get = function() {
  return state.pool
}

exports.compileQuery = function(sql,inserts){
	return mysql.format(sql, inserts);
}