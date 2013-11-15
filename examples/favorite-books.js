var models = require('../support/test-models');
var Bernhard = require('../lib');



var req = { query: { genre: 'Fantasy' }, session: { username: 'dfenster' }};
var res = { json: function(json){ console.log(json); } };


Bernhard.async(function(){
  var current_user = models.User.retrieveByName(req.session.username);
  var favorite_book_ids = current_user.retrieveFavoriteBookIds();
  var genre = models.Genre.retrieveByName(req.query.genre);
  var book_results = models.Book.search({genre: genre.id});
  var response_data = book_results.valueOf().map(function(book){
    return {
      id: book.id,
      title: book.title,
      author: book.retrieveAuthor().name,
      is_favorite: favorite_book_ids.indexOf(book.id) > -1
    };
  });
  res.json(response_data);
});