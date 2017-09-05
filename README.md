node-procedural-async
=====================

Write procedural style code that runs asynchronously. It may look synchronous, but it's not!

### Basic Example

```js
var Bernhard = require('procedural-async');
var models = require('./models');

Bernhard.async(function(){
	try {
		// Not needed now, don't block.
		var current_user = models.User.retrieveByName(req.session.username);
		var genre = models.Genre.retrieveByName(req.query.genre);
		// Will wait on results.
		var book_results = models.Book.search({genre: genre.id});
		var favorite_book_ids = current_user.retrieveFavoriteBookIds();
		var response_data = book_results.map(function(book){
			return {
				id: book.id,
				title: book.title,
				author: book.retrieveAuthor().name,
				is_favorite: favorite_book_ids.indexOf(book.id) > -1
			};
		});
	} catch (e) {
		return next(e);
	}
	
	res.json(response_data);
});
```

**[Full Example Code](https://github.com/shutterstock/node-procedural-async/tree/master/examples/favorite-books.js)**

**[Example Using caolan's (excellent) async](https://github.com/shutterstock/node-procedural-async/tree/master/examples/using_async.js)**

## Features

* Fully asynchronous, with the option to be synchronous
* Execute asynchronous calls immediately, but wait for the results only at the time you need them
* Allows for try/catch error handling
* instances are subclasses of any class you like
* Easy to read and write


## How it Works

Under the hood, **node-procedural-async** uses a combination of [Proxies](http://wiki.ecmascript.org/doku.php?id=harmony:proxies) and [node-fibers](https://npmjs.org/package/fibers).
When you call *Bernhard.generate*, a proxy class is dynamically generated, instanciated and returned. All calls to the proxy will yield until whatever asynchronous task you started has completed. The asynchronous/synchronous magic comes from fibers, so you must write your procedural-async code inside a function that you pass to *Bernhard.async*.


## Installation

The current version requires node.js **[v0.11.4](http://blog.nodejs.org/2013/07/12/node-v0-11-4-unstable/)** and an experimental untagged version of [node-fibers](https://github.com/laverdet/node-fibers/tree/862e306855f432e5a0a669333563ecdf4e9a31ff).

* Install nvm: curl https://raw.github.com/creationix/nvm/master/install.sh | sh
* Install node: nvm install 0.11.4
* Install dependencies: npm install procedural-async
* Run tests: npm test
* Run with harmony: node --harmony your_file.js


## Usage

### Setting Up Your Asynchronous Code
#### Bernhard.generate(Class)
Returns an instance that derives from *Class*. You should return this instance from your asynchronous function immediately.

#### *instance*.callback([err, [result]])
Call this on the instance you got from *Bernhard.generate* when your asynchronous function has completed.

### Using Your Asynchronous Code
#### Bernhard.async(function)
Put all your procedural-async code inside a function that you pass to this method. Inside this function, you can try/catch any errors.


## Authors

This library was developed by [Ben Kovacevich](https://github.com/bkovacevich), [David Fenster](https://github.com/dfenster), and [Carlos Gomez](https://github.com/cgenuity) at [Shutterstock](http://www.shutterstock.com)


## Acknowledgments

This library would not be possible without [Marcel Laverdet's](https://github.com/laverdet) outstanding [fibers](https://github.com/laverdet/node-fibers) library.

## License

[MIT](LICENSE) © 2013-2017 Shutterstock Images, LLC

