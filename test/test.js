'use strict';
var assert = require('assert');
var Bernhard = require('../lib');
var Book = require('../support/test-models').Book;

describe("Basic OO", function(){
  it('should wait to complete before returning attribute values', function (done){
    Bernhard.async(function(){
      var book = Book.findByTitle('some title');
      assert.equal(book.author, "Some Guy");
      done();
    });
  });
  it('should allow for default values without waiting', function (done){
    Bernhard.async(function(){
      assert.equal(new Book().author, "unknown");
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
  var slowReturn = function(value, type){
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
      var b = slowReturn("Hello", String);
      assert(b instanceof String);
      assert.equal(b, "Hello");
      assert.equal(b.length, "Hello".length)
      done();
    });
  });
  it('should act like a Boolean', function(done){
    Bernhard.async(function(){
      var bfalse = slowReturn(false, Boolean);
      var btrue = slowReturn(true, Boolean);
      assert(bfalse instanceof Boolean);
      assert(btrue instanceof Boolean);
      assert.equal(bfalse, false);
      assert.equal(btrue, true);
      done();
    });
  }); 
  it('should act like a Date', function(done){
    Bernhard.async(function(){
      var date = new Date(1384486511617);
      var b = slowReturn(date, Date);
      assert(b instanceof Date);
      assert.equal(b, date.valueOf()); //in all javascript, a date is not equal to its integer value in milliseconds
      // assert.equal(b.getTime(), +date);
      done();
    });    
  });
  it('should act like an Array', function(done){
    Bernhard.async(function(){
      var b = slowReturn(["Hello", "World"], Array);
      assert(b instanceof Array);
      assert.equal(b.length, 2);
      assert.equal(b[0], "Hello");
      assert.equal(b[1], "World");
      assert.deepEqual(b.valueOf(), ["Hello", "World"]);
      done();
    });
  });  
});

describe("Arrays", function(){
  it('should generally work for arrays', function(done){
    Bernhard.async(function(){
      var books = Book.findByAuthor('Tolkien');
      assert(books instanceof Array);
      assert.equal(books.length, 3);
      for (var i in books) {
        console.log(books[i]);
        assert(books[i]);
      }
      done();
    });
  })
});

describe("Errors", function(){
  it('should handle errors', function(done){
    Bernhard.async(function(){
      var books = Book.findByTitle('THROW_ERROR');
      done();
    });
  });
});
