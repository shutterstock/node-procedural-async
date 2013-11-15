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
  };
  o.getOwnPropertyDescriptor = function(name){
    var obj = o.future.wait();
    return Object.getOwnPropertyDescriptor(obj.data, name);
  };
  o.getPropertyDescriptor = function(name){
    var obj = o.future.wait();
    return Object.getOwnPropertyDescriptor(obj.data, name) || Object.getOwnPropertyDescriptor(obj.data.prototype, name);
  };
  o.getPropertyNames = function () {
    var obj = o.future.wait();
    return us.union(Object.getOwnPropertyNames(obj.data), Object.getOwnPropertyNames(obj.data.prototype));
  };
  o.getOwnPropertyNames = function () {
    var obj = o.future.wait();
    return Object.getOwnPropertyNames(obj.data);
  };
  o.defineProperty= function (name, propertyDescriptor) {
    var obj = o.future.wait();
    return Object.getOwnPropertyNames(obj.data, name, propertyDescriptor);
  };
  o.delete = function (key) {
    var obj = o.future.wait();
    return delete obj.data[key];
  };
  o.fix = function (){
    var obj = o.future.wait();
    var return_value = us.object(o.getPropertyNames, o.getPropertyNames.map(function (name) {return o.getPropertyDescriptor(name)}));
    this = obj;
    return return_value;
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

