'use strict';
var assert = require('assert');
var Bernhard = require('../lib');

describe("Basic OO", function(){
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

  it('should wait to complete before returning attribute values', function (done){
    Bernhard.async(function(){
      var book = Book.findByTitle('some title');
      assert(book.author, "Some Guy");
      done();
    });
  });
  it('should allow for default values without waiting', function (done){
    Bernhard.async(function(){
      assert(new Book().author, "unknown");
      done();
    });
  });
  it('should be an instance of the original class', function(done){
    Bernhard.async(function(){
      var book = Book.findByTitle('some title');
      assert(instanceof book, Book);
      done();
    });    
  })
});

describe("Scalars", function(){
  var slowAddTwoNumbers = function(first, second, callback){
    var b = new Bernhard.generate(Number, false);
    setTimeout(function(){
      return callback(null, first + second);
    }, 500);
    return b;
  };

  it('should ', function(done){
    Bernhard.async(function(){
      var numero = new Bernhard.generate(Number);
      slowAddTwoNumbers(2, 2, numero.callback);
      assert(instanceof Number, numero);
      done();
    });
  });
});
