var Future = require('fibers/future')
var us = require('underscore');
var util = require('util');

var forwarder = function(o){
  var keys = us.object(Object.keys(Bernhard),Object.keys(Bernhard));
  o.get = function(proxy, name) {
    if(keys[name]) return o[name].bind(o);
    console.log(name);
    if (name !== 'data') return o.future.wait().data[name];
  };
  o.enumerate = function () {
    var obj = o.future.wait();
    return obj.getPropertyNames().filter(
      function (name) {
        return obj.getPropertyDescriptor(name).enumerable
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
  return this.future.wait().data.valueOf();
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

