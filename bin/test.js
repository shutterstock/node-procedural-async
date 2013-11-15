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

Book.findByAuthor = function findByAuthor(author){
  var b = new Bernhard.generate(Book, true);
  mysql.query("SELECT MANY THINGS", [author], b.callback);
}

Book.prototype.author = "unknown";



//---------------------------Controller logic---------------------------------------------

Bernhard.async(function(){


  var book = Book.findByTitle('some title');
  console.log('author: ', book.author);
  console.log("default author: ", new Book().author);
  console.log("book is a Book: ", book instanceof Book);


});



//---------------------------- mock functions ---------------------------------------


var mysql = {
  query: function(sql, params, callback){
    console.log("performing query");
    if(/SOMETHING/.test(sql)){
      setTimeout(function(){
        return callback(null, [{title: params[0], author: "Some Guy"}])
      }, 1000);
    } else {
      setTimeout(function(){
        return callback(null, [
          {author: params[0], title: "The Fellowship of the Ring"},
          {author: params[0], title: "The Two Towers"},
          {author: params[0], title: "The Return of the King"},
        ]);
      }, 3000);
    }
  }
}