var Future = require('fibers/future')
var us = require('underscore');
var util = require('util');

var forwarder = function(o){
  o.get = function(proxy, name) {
    if(bernhard_keys.hasOwnProperty(name)) return o[name].bind(o);
    if (name !== 'data') return o.future.wait().data[name];
  };
  o.set = function (proxy, key, value) {
    this[data] 
  },
  o.enumerate = function () {
    var obj = o.future.wait();
    return Object.keys(obj.data).filter(
      function (key) {
        return obj.data[key]
      }
    );
  }
  return o;
};

var Bernhard = function(){}
Bernhard.callback = function bernhardCallback(err, data){
  if(err) throw err;
  this.data = data;
  this.future.return(this);
}


Bernhard.generate = function bernhardGenerate(Class){
  if(!Class.bernhardClass){
    Class.bernhardClass = function Bernhard(){
      this.future = new Future();
      this.data = {};
    }
    util.inherits(Class.bernhardClass, Class);

    Class.bernhardClass.prototype.callback = Bernhard.callback;
    Class.bernhardClass.prototype.valueOf = Bernhard.valueOf;
    Class.bernhardClass.prototype.wait    = Bernhard.wait;
  }

  var b = new Class.bernhardClass();
  var p = Proxy.create(forwarder(b), Class.bernhardClass.prototype);
  return p;
}

Bernhard.valueOf = function valueOf(){
  return this.future.wait().data.valueOf();
}

Bernhard.wait = function () {
  return this.future.wait();
}

Bernhard.async = function bernhardAsync(fn){
  fn = fn.future();
  fn().resolve(function(err, val){
    if(err) throw err;
    if(val) console.log("FINAL VALUE:", val);
  })
}

bernhard_keys = us.object(Object.keys(Bernhard), Object.keys(Bernhard));

module.exports = Bernhard;

