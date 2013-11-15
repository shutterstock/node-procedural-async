'use strict';
var assert = require('assert');
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
      assert(book instanceof Book);
      done();
    });    
  })
});

describe("Scalars", function(){
  var slowAddTwoNumbers = function(first, second){
    var b = new Bernhard.generate(Number);
    setTimeout(function(){
      return b.callback(null, first + second);
    }, 500);
    return b;
  };
  var slowReturn = function(value){
    var type = typeof value;
    type = eval(type.charAt(0).toUpperCase() + type.slice(1));
    var b = new Bernhard.generate(type);
    setTimeout(function(){
      return b.callback(null, value);
    }, 500);
    return b;
  };

  it('should act like a Number', function(done){
    Bernhard.async(function(){
      var b = slowAddTwoNumbers(2, 2);
      assert(b instanceof Number);
      assert.equal(b, 4);
      done();
    });
  });
  it('should act like a String', function(done){
    Bernhard.async(function(){
      var b = slowReturn("Hello");
      assert(b instanceof String);
      assert.equal(b, "Hello");
      done();
    });
  });
  it('should act like a Boolean', function(done){
    Bernhard.async(function(){
      var bfalse = slowReturn(false);
      var btrue = slowReturn(true);
      assert(bfalse instanceof Boolean);
      assert(btrue instanceof Boolean);
      assert.equal(bfalse, false);
      assert.equal(btrue, true);
      done();
    });
  }); 
  it('should act like a Date', function(done){
    Bernhard.async(function(){
      var date = new Date();
      var b = slowReturn(date);
      assert(b instanceof Date);
      assert.equal(b, date);
      done();
    });    
  });
});

describe("Arrays", function(){
  it('should generally work for arrays', function(done){
    Bernhard.async(function(){
      var books = Book.findByAuthor('Tolkien');
      assert.equal(books.length, 3);
      done();
    });
  })
})