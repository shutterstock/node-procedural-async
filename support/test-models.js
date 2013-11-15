var Bernhard = require('../lib');
var us = require('underscore');

var User = module.exports.User = function User(){}
User.all = {
  "dfenster": {id: 1, username: "dfenster", favorites: [8, 11]},
  "bkovacevich": {id: 2, username: "bkovacevich"},
  "cgomez": {id: 3, username: "cgomez"}
};
User.retrieveByName = function retreiveByName(username){
  var b = new Bernhard.generate(User);
  setTimeout(function(){
    return b.callback(null, us.extend(new User(), User.all[username]));
  }, 50);
  return b;
};
User.prototype.retrieveFavoriteBookIds = function retrieveFavoriteBookIds(){
  var self = this;
  var b = new Bernhard.generate(Array);
  setTimeout(function(){
    return b.callback(null, self.favorites);
  }, 50);  
  return b;
};

var Book = module.exports.Book = function Book(){}
Book.all = {
  1: us.extend(new Book(), {id: 1, title: "Frost Burned", author_id: 1, book_series_id: 1, genre_id: 2}),
  2: us.extend(new Book(), {id: 2, title: "Moon Called", author_id: 1, book_series_id: 1, genre_id: 2}),
  3: us.extend(new Book(), {id: 3, title: "River Marked", author_id: 1, book_series_id: 1, genre_id: 2}),
  4: us.extend(new Book(), {id: 4, title: "The Striker", author_id: 2, genre_id: 3}),
  5: us.extend(new Book(), {id: 5, title: "Earn the Right to Win", author_id: 3, genre_id: 4}),
  6: us.extend(new Book(), {id: 6, title: "Inferno", author_id: 4, genre_id: 3}),
  7: us.extend(new Book(), {id: 7, title: "The Rainbow Abyss", author_id: 6, book_series_id: 3, genre_id: 1}),
  8: us.extend(new Book(), {id: 8, title: "The Magicians of Night", author_id: 6, book_series_id: 3, genre_id: 1}),
  9: us.extend(new Book(), {id: 9, title: "The Eye of the World", author_id: 5, book_series_id: 2, genre_id: 1}),
  10: us.extend(new Book(), {id: 10, title: "The Gathering Storm", author_id: 5, book_series_id: 2, genre_id: 1}),
  11: us.extend(new Book(), {id: 11, title: "The Towers of Midnight", author_id: 5, book_series_id: 2, genre_id: 1})
}

Book.findByTitle = function findByTitle(title){
  var b = new Bernhard.generate(Book); 
  mysql.query("SELECT SOMETHING", [title], function(err, results){
    b.callback(err, results[0]);
  });
  return b;
}

Book.findByAuthor = function findByAuthor(author){
  var b = new Bernhard.generate(Array);
  mysql.query("SELECT MANY THINGS", [author], b.callback);
  return b;
}

Book.search = function search(filter){
  var b = new Bernhard.generate(Array);
  setTimeout(function(){
    var results = Object.keys(Book.all).map(function(id){ return Book.all[id]; }).filter(function(book){ return book.genre_id == filter.genre});
    return b.callback(null, results);
  }, 400);
  return b;
}

Book.prototype.retrieveAuthor = function retrieveAuthor(){
  return Author.retrieveById(this.author_id);
}

Book.prototype.author = "unknown";


var Genre = module.exports.Genre = function Genre(){};
Genre.all = {
  1: us.extend(new Genre(), {id: 1, name: "Fantasy"}),
  2: us.extend(new Genre(), {id: 2, name: "Romance"}),
  3: us.extend(new Genre(), {id: 3, name: "Fiction"}),
  4: us.extend(new Genre(), {id: 4, name: "Sports"})
};
Genre.retrieveByName = function retrieveByName(name){
  var b = new Bernhard.generate(Genre);
  setTimeout(function(){
    var results = Object.keys(Genre.all).map(function(id){ return us.extend(new Genre(), Genre.all[id]); }).filter(function(genre){return genre.name == name});
    return b.callback(null, results[0]);
  }, 400);
  return b;  
}


var Author = module.exports.Author = function Author(){};
Author.all = {
  1: us.extend(new Author(), {id: 1, name: "Patricia Briggs"}),
  2: us.extend(new Author(), {id: 2, name: "Clive Cussler"}),
  3: us.extend(new Author(), {id: 3, name: "Tom Coughlin"}),
  4: us.extend(new Author(), {id: 4, name: "Dan Brown"}),
  5: us.extend(new Author(), {id: 5, name: "Robert Jordan"}),
  6: us.extend(new Author(), {id: 6, name: "Barbara Hambly"})
};
Author.retrieveById = function retrieveById(id){
  var b = new Bernhard.generate(Author);
  setTimeout(function(){
    return b.callback(null, Author.all[id]);
  }, 50);  
  return b;
};


var mysql = {
  query: function(sql, params, callback){
    if(/ERROR/.test(params)){
      throw new Error("YOU SHALL NOT PASS!");
    } else if(/SOMETHING/.test(sql)){
      setTimeout(function(){
        return callback(null, [{title: params[0], author: "Some Guy"}])
      }, 500);
    } else {
      setTimeout(function(){
        return callback(null, [
          {id: 1, author: params[0], title: "The Fellowship of the Ring"},
          {id: 2, author: params[0], title: "The Two Towers"},
          {id: 3, author: params[0], title: "The Return of the King"},
        ]);
      }, 1000);
    }
  }
}
