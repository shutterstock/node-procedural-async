var Future = require('fibers/future')
var us = require('underscore');
var util = require('util');

var forwarder = {
  get: function(proxy, name) {
    if (name !== 'data') this.future.wait().data[name];
  }
};

var Bernhard = function(){}
Bernhard.callback = function bernhardCallback(err, data){
  if(err) throw err;
  us.extend(this.data, data);
  this.future.return(this);
}

Bernhard.generate = function bernhardGenerate(Class, returns_array){
  if(!Class.bernhardClass){
    Class.bernhardClass = function Bernhard(){
      this.future = new Future();
      this.data = {};
    }
    util.inherits(Class.bernhardClass, Class)

    Class.bernhardClass.prototype.callback = Bernhard.callback;
  }
  return Proxy.create(forwarder, Class.bernhardClass.prototype);
}

Bernhard.async = function bernhardAsync(fn){
  fn = fn.future();
  fn();
}

module.exports = Bernhard;
