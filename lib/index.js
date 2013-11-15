var Future = require('fibers/future')
var us = require('underscore');
var util = require('util');

var forwarder = function(o){
  o.get = function(proxy, name) {
    if(Bernhard.hasOwnProperty(name)) return o[name].bind(o);
    if (name !== 'data') return o.future.wait().data[name];
  };
  return o;
};

var Bernhard = function(){}
Bernhard.callback = function bernhardCallback(err, data){
  if(err) throw err;
  if(this instanceof Number || this instanceof String || this instanceof Boolean) this.data = data;
  else us.extend(this.data, data);
  this.future.return(this);
}

Bernhard.generate = function bernhardGenerate(Class, returns_array){
  if(!Class.bernhardClass){
    Class.bernhardClass = function Bernhard(){
      this.future = new Future();
      this.data = {};
    }
    util.inherits(Class.bernhardClass, Class);

    Class.bernhardClass.prototype.callback = Bernhard.callback;
    Class.bernhardClass.prototype.valueOf = Bernhard.valueOf;
  }

  var b = new Class.bernhardClass();
  var p = Proxy.create(forwarder(b), Class.bernhardClass.prototype);
  return p;
}

Bernhard.valueOf = function valueOf(){
  return this.future.wait().data;
}

Bernhard.async = function bernhardAsync(fn){
  fn = fn.future();
  fn();
}

module.exports = Bernhard;
