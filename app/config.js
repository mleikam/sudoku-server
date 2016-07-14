// config params

var version = '0.5'; 

var SERVER_PORT = 23270; 

var lib = '/home/leikam/webapps/kenken/lib/';
var modules = lib+'node_modules/';
var db_settings = {
	connectionLimit : 100, //important
	host     : 'localhost',
	user     : 'leikam_kenken',
	password : '2)8Mb,(bST-cY3HZ',
	database : 'leikam_kenken',
	debug    :  false
  // debug: ['ComQueryPacket', 'RowDataPacket']
};

var STRINGS = {}
STRINGS.NO_SUCH_PUZZLE = 'No such puzzle exists'

module.exports = Object.freeze({
  getLib: () => lib,
  getModuleDir: () => modules,
  getDB: () => db_settings,
  version: () => version,
  getWebServerPort: () => SERVER_PORT,
  DB_CONNECTION_NOT_ATTEMPTED: 0,
  DB_CONNECTION_ATTEMPTED: 1,
  DB_CONNECTION_ERROR:  -1,
  DB_QUERY_ERROR:  -2,
  DB_QUERY_SUCCESS: 9,
  NO_QUERY_ERROR: -9,
  TYPE_KENKEN : 'k',
  TYPE_SUDOKU : 's',
  strings : STRINGS,
  STATUS_KEY: 'status',
  // access_control_domain: 'leikam.com',
  access_control_domain: '*',
});
