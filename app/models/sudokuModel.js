// sudoku model

// @todo : much cleanup needed


var db = require('./db');
/*

.....6.....5....6..3.9......5...9.1.7...3.89.8.9.1.5.6...1.79.....8....4.76.5...1
198526743425378169637941258253689417761435892849712536384167925512893674976254381

  0, 1, 2,  3, 4, 5,  6, 7, 8
  9,10,11, 12,13,14, 15,16,17
 18,19,20, 21,22,23, 24,25,26

 27,28,29, 30,31,32, 33,34,35
 36,37,38, 39,40,41, 42,43,44
 45,46,47, 48,49,50, 51,52,53

 54,55,56, 57,58,59, 60,61,62
 63,64,65, 66,67,68, 69,70,71
 72,73,74, 75,76,77, 78,79,80

*/

//////////
// MAIN

var puzzle_id = 0; 

var PID = {
    swap : 100,
    col : 10,
    row : 1,
    group : 1000
}

var Query = {sql:'',args:[]}
var width = 9; 

var labels  = '.....6.....5....6..3.9......5...9.1.7...3.89.8.9.1.5.6...1.79.....8....4.76.5...1';
var answers = '198526743425378169637941258253689417761435892849712536384167925512893674976254381';

labels = labels.split('');
// labels = labels.map(function(val){ return parseInt(val) })

answers = answers.split('');
answers = answers.map(function(val){ return parseInt(val) })

// list of indices for a width x width grid
var n = 0;
var list = Array(width*width).fill(0).map(function(){ n+=1; return n%9+1; });

// answers = list; // dev

// main accessors
exports.createQuery = function(){
    console.log('sudokuModel.createQuery')
    _doTransforms();
    makeQuery();
}

exports.getSQL = function(){
    return Query.sql;
}

exports.getArgs = function(){
    return Query.args;
}

// test function 
exports.test = function(){
    _doTransforms();
}

// the internals

function makeQuery(){
    // not implemented
    // 
    var sql = 'SELECT ? as puzzle_id,? as width, ? as height, ? as difficulty, ';
    sql += '? as labels, ? as shapes, ? as answers';
    var args = [];
    args.push( puzzle_id );   // puzzle id
    args.push(9);   // width
    args.push(9);   // height
    args.push(3);   // difficulty
    // labels
    var L = labels.join('')
    args.push(L);
    // shapes
    var a = 'a a a b b b c c c ', b = 'd d d e e e f f f ', c = 'g g g h h h i i i ';
    args.push(a+a+a+b+b+b+c+c+c);
    // answers
    var A = answers.join('');
    args.push(A)
    // args.push(answers);
    console.log('answers = '+answers)
    console.log('labels  = '+labels)

    Query.sql = sql;
    Query.args = args;
    // var combined = db.compileQuery(sql, args);
    // console.log(combined)
}

function _doTransforms(){
    puzzle_id = 0; 
    console.log('transforming...')

    // rows
    var swaps = Math.floor( Math.random()*4); // less than 4 swaps
    for(i in Array( swaps ).fill(1) ){
        var g = Math.floor( Math.random()*3);
        var a = Math.floor( Math.random()*3);
        var b = Math.floor( Math.random()*3);
        swapRows([g,a],[g,b]);
    }
    // columns
    var swaps = Math.floor( Math.random()*4); // less than 4 swaps
    for(i in Array( swaps ).fill(1) ){
        var g = Math.floor( Math.random()*3);
        var a = Math.floor( Math.random()*3);
        var b = Math.floor( Math.random()*3);
        swapCols([g,a],[g,b]);
    }

    // numbers
    var swaps = Math.floor( Math.random()*5); // less than 5 swaps
    for(i in Array( swaps ).fill(1) ){
        var a = Math.ceil( Math.random()*width ); 
        var b = Math.ceil( Math.random()*width ); 
        swapNumbers(a,b);
    }

    // horizontal
    var swaps = Math.floor( Math.random()*2); // less than 2 swaps
    for(i in Array( swaps ).fill(1) ){
        var a = Math.ceil( Math.random()*width ); 
        var b = Math.ceil( Math.random()*width ); 
        swapGroupsHorizontal(a,b);
    }

    // vertical
    var swaps = Math.floor( Math.random()*2); // less than 2 swaps
    for(i in Array( swaps ).fill(1) ){
        var a = Math.ceil( Math.random()*width ); 
        var b = Math.ceil( Math.random()*width ); 
        swapGroupsVertical(a,b);        
    }

    // swapRows([2,1],[2,0]);
    // swapRows([0,1],[0,0]);
    // swapNumbers(2,8);
    // swapCols([0,1],[0,2])
    // swapGroupsVertical(0,1)
    // swapGroupsHorizontal(1,2);

    // console.log('done with xforming')
    // console.log('answers = '+answers)
    // console.log('labels  = '+labels)
}

function _getList(str){
    return str.split('');
}


// this is what does the heavy work of altering the lists
function _swapByIndex(index1,index2,list){
    // a = [1,2,3]; b=[4,5,6]; c = a[1]; d = b[1]; a.splice(1,1,d); b.splice(1,1,c); [a,b]
    var c = list[index1];
    var d = list[index2];
    list.splice(index1,1,d);
    list.splice(index2,1,c);
}

// swap rows a and b within spanish square s
// sa = first square; sb = second square
// swapRows(sa,sb,a,b)
// swapRows(sa/sb,a,b)
// swapRows([sa,a],[sb,b])
function swapRows(){
    if( arguments.length==2 ){
        var sa = arguments[0][0];
        var a = arguments[0][1];
        var sb = arguments[1][0];
        var b = arguments[1][1];
    // } else if( arguments.length==3 ){
    //     var sa = arguments[0];
    //     var sb = arguments[0];
    //     var a = arguments[1];
    //     var b = arguments[2];
    // } else if( arguments.length==4){
    //     var sa = arguments[0];
    //     var sb = arguments[1];
    //     var a = arguments[2];
    //     var b = arguments[3];
    }    
    if(a==b){return false;}
    // normalize our inputs
    var sa = sa%3;
    var sb = sb%3;
    var a = a%3;
    var b = b%3;
    console.log('swapRows sa='+sa+'; sb='+sb+'; a='+a+'; b='+b);
    
    var start_a = width*(sa*3+a);
    var start_b = width*(sb*3+b);
    // console.log('start_a='+start_a+'; start_b='+start_b)

    var row1 = list.slice( start_a,start_a+width ); 
    var row2 = list.slice( start_b,start_b+width );

    for(var i=0;i<width;i++){
        var index1 = row1[i];
        var index2 = row2[i];
        _swapByIndex(index1,index2,answers);
        _swapByIndex(index1,index2,labels);
    }
    // console.log('answers='+answers)
    // console.log('answers='+labels)
    puzzle_id += PID.row;
}

// function swapCols(sa,sb,a,b){
// swapCols([sa,a],[sb,b])
function swapCols(){
    var sa = arguments[0][0];
    var a = arguments[0][1];
    var sb = arguments[1][0];
    var b = arguments[1][1];
    if(a==b){return false;}
    // normalize our inputs
    var sa = sa%3;
    var sb = sb%3;
    var a = a%3;
    var b = b%3;
    console.log('swapCols sa='+sa+'; sb='+sb+'; a='+a+'; b='+b);

    var row1 = [];
    var row2 = [];
    for(var i=0;i<width;i++){
        var x = width*i+(a+sa*3);
        var y = width*i+(b+sb*3); 
        row1.push(x);
        row2.push(y);
    }

    // console.log('row1='+row1);
    // console.log('row2='+row2);

    for(var i=0;i<width;i++){
        var index1 = row1[i];
        var index2 = row2[i];
        _swapByIndex(index1,index2,answers);
        _swapByIndex(index1,index2,labels);
    }
    puzzle_id += PID.col;
}

function swapGroupsVertical(a,b){
    if(a==b){ return false; }
    console.log('swapGroupsVertical a='+a+'; b='+b)
    for(var i=0;i<3;i++){
        swapCols([a,i],[b,i]);
    }
    puzzle_id += PID.group; 
}

function swapGroupsHorizontal(a,b){
    if(a==b){ return false; }
    console.log('swapGroupsHorizontal a='+a+'; b='+b)
    for(var i=0;i<3;i++){
        swapRows([a,i],[b,i]);
    }
    puzzle_id += PID.group; 
}

// doesn't work because the labels list is incomplete.  you need to use the 
// index from the answers list on the labels array
// function swapNumbers(n1,n2){
//     if(n1==n2){
//         return false;
//     }
//     var n = n1%width;
//     var m = n2%width;
//     console.log('swapping '+n+' with '+m)
//     console.log('answers = '+answers)
//     var lists = [answers,labels];
//     for(var k=0;k<lists.length;k++){
//         var LIST = lists[k];
//         var a = b = -1;
//         var row1 = [];
//         var row2 = [];
//         for(var i=0;i<width;i++){
//             a = LIST.indexOf(n,a+1);
//             b = LIST.indexOf(m,b+1);
//             row1.push(a);
//             row2.push(b);
//         }
//         console.log('row1='+row1);
//         console.log('row2='+row2);
//         for(var i=0;i<width;i++){
//             var index1 = row1[i];
//             var index2 = row2[i];
//             _swapByIndex(index1,index2,LIST);
//         }
//         console.log('LIST = '+LIST)
//     }
// }

function swapNumbers(n1,n2){
    if(n1==n2){
        return false;
    }
    // var n = n1%width;
    // var m = n2%width;
    var n = n1; var m = n2; 
    console.log('swapping numbers '+n+' with '+m)
    // console.log('pre  answers = '+answers)
    var a = 0;
    var b = 0;
    var row1 = [];
    var row2 = [];
    for(var i=0;i<width;i++){
        a = answers.indexOf(n,a);
        b = answers.indexOf(m,b);
        row1.push(a);
        row2.push(b);
// console.log('n='+n+'; a='+a+' ('+answers[a]+') at 5='+answers[5]+' type='+typeof(answers[5]) );
// console.log('m='+m+'; b='+b+' ('+answers[b]+')');
        a = a+1; 
        b = b+1; 
    }
    // console.log('row1='+row1);
    // console.log('row2='+row2);
    for(var i=0;i<width;i++){
        var index1 = row1[i];
        var index2 = row2[i];
        _swapByIndex(index1,index2,answers);
        _swapByIndex(index1,index2,labels);
    }
    // console.log('answers = '+answers)
    // console.log('labels       = '+labels)
    puzzle_id += PID.swap; 
}

