var Bernhard = require('../lib/');

function Book(){
}

Book.findByTitle = function findByTitle(title){
  var b = new Bernhard.generate(Book); 
  mysql.query("SELECT SOMETHING", [title], function(err, results){
    b.callback(err, results[0]);
  });
  return b;
}

Book.prototype.author = "unknown";



//---------------------------Controller logic---------------------------------------------

var doSomething = function(){
  var book = Book.findByTitle('some title');

  console.log('author: ', book.author, new Book().author, book instanceof Book);
}.future();
doSomething();



//---------------------------- mock functions ---------------------------------------


var mysql = {
  query: function(sql, params, callback){
    console.log("performing query");
    setTimeout(function(){
      return callback(null, [{title: params[0], author: "Some Guy"}])
    }, 3000);
  }
}