// tester

var cfg = require('./config');
var db = require('./models/db')

// Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function(err) {
	if (err) {
		console.log('Unable to connect to database')
		process.exit(1)
	}
	console.log('DB is open')
})

var View = require('./views/view');

var cb = View.testRender; 

var Puzzle = require('./models/model')

Puzzle.get( cb ); 
// var query = Puzzle.getQuery();



// THIS WORKS
// function _doQuery(done){
// 	db.get().query('Select puzzle_id FROM puzzle ORDER BY RAND() LIMIT ?',[2], 
// 	function (err, rows) {
// 	    if (err) return done(err)
// 	    done(null, rows)
//   	})
// }
// var _handle_rows = function(a,b){
// 	// console.log('a='+a);
// 	console.log('b='+b);
// 	for(i in b){
// 		console.log( b[i].puzzle_id );
// 	}
// }
// _doQuery(_handle_rows);
