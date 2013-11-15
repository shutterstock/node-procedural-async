var models = require('../support/test-models');
var async  = require('../support/test-models');

var req  = { query: { genre: 'Fantasy' }, session: { username: 'dfenster' }};
var res  = { json: function(json){ console.log(json); } };
var next = function(err){ console.error(err); };

async.auto({
  current_user: function (cb){
    models.User.retrieveByName(req.session.username, function (e, r){
      if (e) return cb(e);
      return cb(null, r);
    });
  },
  genre: function (cb){
    models.Genre.retrieveByName(req.query.genre, function (e, r){
      if (e) return cb(e);
      return cb(null, r);
    });
  },
  book_results: ['genre', function (cb, results) {
    models.Book.search({genre: results.genre.id}, function(e, r){
      if (e) return cb(e);
      return cb(null, r);
    });
  }],
  favorite_book_ids: ['current_user', function (cb, results) {
    results.current_user.retrieveFavoriteBookIds(function (e, r){
      if (e) return cb(e);
      return cb(null, r);
    });
  }],
}, function (e, r) {
  if (e) return next(e);
  var response_data = r.book_results.map(function(book){
    return {
      id: book.id,
      title: book.title,
      author: book.retrieveAuthor().name,
      is_favorite: r.favorite_book_ids.indexOf(book.id) > -1
    };
  });
  res.json(response_data);
});
