'use strict';
var Bernhard = require('../lib');

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

var mysql = {
  query: function(sql, params, callback){
    if(/SOMETHING/.test(sql)){
      setTimeout(function(){
        return callback(null, [{title: params[0], author: "Some Guy"}])
      }, 500);
    } else {
      setTimeout(function(){
        return callback(null, [
          {author: params[0], title: "The Fellowship of the Ring"},
          {author: params[0], title: "The Two Towers"},
          {author: params[0], title: "The Return of the King"},
        ]);
      }, 1000);
    }
  }
}




describe("Basic OO", function(){
  it('should wait to complete before returning attribute values', function (done){
    Bernhard.async(function(){
      var book = Book.findByTitle('some title');
      book.author.should.equal("Some Guy");
      done();
    });
  });
  it('should allow for default values without waiting', function (done){
    Bernhard.async(function(){
      new Book().author.should.equal("unknown");
      done();
    });
  });
  it('should be an instance of the original class', function(done){
    Bernhard.async(function(){
      var book = Book.findByTitle('some title');
      (book instanceof Book).should.be.true;
      done()
    });    
  })
});

describe("Arrays", function(){
  it('should generally work for arrays', function(done){
    Bernhard.async(function(){
      var books = Book.findByAuthor('Tolkien');
      books.length.should.equal(3);
      done();
    });
  })
})