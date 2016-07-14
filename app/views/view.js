// view component

var cfg = require('../config');

var myRes = null; 

var status_key = cfg.STATUS_KEY;

var request_params = {}

var type = cfg.TYPE_KENKEN; 

// testing version 
exports.testRender = function(err,data){
	console.log('error='+err)
	console.log('data='+data)
}

exports.setRes = function(res){
	myRes = res; 
}

// exports.setType = function(t){
// 	console.log('View set type to '+t)
// 	type = t; 
// }

exports.renderPuzzle = function(err,data){
	console.log('renderPuzzle called')
	console.log('myRes is '+typeof(myRes));

	if( typeof(err)!==typeof(null) ){
		//myRes.json('Puzzle Error: '+err);
		exports.showError(err)
		return;
	}
	if(data==null){
		//myRes.json('Somehow I produced neither puzzle nor error');
		exports.showError('Somehow I produced neither puzzle nor error '+err)
		return;
	}

	console.log('passed our exit tests for type '+ data.type)
	// data['rendered'] = true;
	data[status_key] = true;

	type = data.type; 
	data['puzzle_type'] = type; 

	var D = compileConfig(data);
	var S = parseShapes(data['shapes']);
	delete(data['labels']);
	delete(data['shapes']);

	data['answers'] = parseAnswers(data['answers']);
	data['shapes'] = S;
	data['config'] = D;

	myRes.setHeader('Access-Control-Allow-Origin', cfg.access_control_domain);
	myRes.json(data);
}

exports.showError = function(e){
	var obj = {}
	obj[status_key] = false;
	obj.message = e; 
	myRes.json(obj);
}

exports.setParams = function(p){
	module.request_params = p;
}

function compileConfig(data){

	var L = parseLabels(data['labels']);
	var S = parseShapes(data['shapes']);
	var A = parseAnswers(data['answers']);
	var w = data['width'];
	var h = data['height'];

	var c = [];

	if( type===cfg.TYPE_KENKEN ){
		for(var i=0;i<S.length;i++){
			var a = S[i];
			var border = getBorders(i,S,w);
			var answer = parseInt(A[i]);
	//		var label = typeof(L[a])===typeof(null) ? null : L[a].replace('/','&#247;');
			var label = typeof(L[a])===typeof(null) ? null : L[a]; //  3/
			L[a] = null;
			var tuple = [label,answer,border];
			c.push(tuple);
		}
	} else {
		for(var i=0;i<S.length;i++){
			var a = S[i];
			var border = getBorders(i,S,w);
			var answer = parseInt(A[i]);
			var label = typeof(L[i])===typeof(null) ? null : L[i]; //  3/
			var tuple = [label,answer,border];
			c.push(tuple);
		}
	}

	return c; 

}

function getBorders(i,S,w){
	var b = '';
	b += S[i]==S[i-w] ? '' : '1'; 
	var m = (i % parseInt(w)); 
	if(m==w-1){ b+= '2' }
	b += S[i]==S[i+w] ? '' : '3';
	b += S[i]==S[i-1] ? '' : '4'; 
	return b;
}

function parseShapes(s){
	s = s.trim();
	var r = s.split(/\s+/g);
	return r; 
}

function parseAnswers(s){
	s = s.trim();
	var r = s.split(/\s*/g);
	return r; 
}

function parseLabels(s){
	s = s.trim();
	// console.log('In parseLabels with type='+type)
	if( type===cfg.TYPE_KENKEN ){
		return _parseKenKenLabels(s)
	} else {
		return _parseSudokuLabels(s);
	}
	// console.log('map='+map)
//	return map; 

	function _parseKenKenLabels(s){
		var map = {}
		var elements = s.split(/\s/g);
		for(var i=0;i<elements.length;i++){
			var x = elements[i].split('=');
			var key = x[0];
			var data = x[1];
			map[key]= data;
		}
		return map;
	}

	function _parseSudokuLabels(s){
		var map = []
		var elements = s.split('');
		// console.log('string='+s)
		// console.log('elements='+elements)
		for(var i=0;i<elements.length;i++){
			var data = elements[i]=='.' ? null : elements[i];
			map[i]= data;
		}
		return map;
	}


}

