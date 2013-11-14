var Future = require('fibers/future')
var us = require('underscore');
var util = require('util');

var Bernhard = function(){}
Bernhard.callback = function bernhardCallback(err, data){
  if(err) throw err;
  us.extend(this.data, data);
  this.future.return(this);
}

Bernhard.generate = function bernhardGenerate(Class){
  if(!Class.bernhardClass){
    Class.bernhardClass = function Bernhard(){
      this.future = new Future();
      this.data = {};
    }
    util.inherits(Class.bernhardClass, Class)

    var proto_keys = Object.keys(Class.prototype);
    for(var i=0; i<proto_keys.length; i++){
      var proto_key = proto_keys[i];
      Object.defineProperty(Class.bernhardClass.prototype, proto_key, {
        get: function(){
          return this.future.wait().data.author;
        }
      });
    }

    Class.bernhardClass.prototype.callback = Bernhard.callback;
  }
  return new Class.bernhardClass();
}

module.exports = Bernhard;