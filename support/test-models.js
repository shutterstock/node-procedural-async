var Bernhard = require('../lib');
var us = require('underscore');

var User = module.exports.User = function User(){}
User.all = {

};
User.retrieveByName = function retreiveByName(username){

}

var Book = module.exports.Book = function Book(){
}

Book.all = {
  1: us.extend(new Book(), {id: 1, title: "Frost Burned", authorId: 1, bookSeriesId: 1, genreId: 2}),
  2: us.extend(new Book(), {id: 2, title: "Moon Called", authorId: 1, bookSeriesId: 1, genreId: 2}),
  3: us.extend(new Book(), {id: 3, title: "River Marked", authorId: 1, bookSeriesId: 1, genreId: 2}),
  4: us.extend(new Book(), {id: 4, title: "The Striker", authorId: 2, genreId: 3}),
  5: us.extend(new Book(), {id: 5, title: "Earn the Right to Win", authorId: 3, genreId: 4}),
  6: us.extend(new Book(), {id: 6, title: "Inferno", authorId: 4, genreId: 3}),
  7: us.extend(new Book(), {id: 7, title: "The Rainbow Abyss", authorId: 6, bookSeriesId: 3, genreId: 1}),
  8: us.extend(new Book(), {id: 8, title: "The Magicians of Night", authorId: 6, bookSeriesId: 3, genreId: 1}),
  9: us.extend(new Book(), {id: 9, title: "The Eye of the World", authorId: 5, bookSeriesId: 2, genreId: 1}),
  10: us.extend(new Book(), {id: 10, title: "The Gathering Storm", authorId: 5, bookSeriesId: 2, genreId: 1}),
  11: us.extend(new Book(), {id: 11, title: "The Towers of Midnight", authorId: 5, bookSeriesId: 2, genreId: 1})
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
    var results = Object.keys(Book.all).map(function(id){ return Book.all[id]; }).filter(function(book){return book.genreId == filter.genreId});
    return b.callback(null, results);
  }, 400);
  return b;
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
