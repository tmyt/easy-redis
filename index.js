var Dynamic = require('dynamic');
var redis = require('redis');
var deasync = require('deasync');

var Easy = function(async){
  var inner = {
    client: redis.createClient(),
    get: function(n){
      if(async) return function(f){ this.client.get(n, f); };
      var ret, got;
      this.client.get(n, function(e,r){
        ret = r;
        got = true;
      });
      deasync.loopWhile(function(){ return !got; });
      return ret;
    },
    set: function(n, v){
      this.client.set(n, v);
    },
    on: function(n, f){
      this.client.subscribe(n);
      this.client.on('message', f);
    },
    emit: function(n, v){
      this.client.publish(n, v);
    },
    close: function(){
      this.client.quit();
    }
  };
  return new Dynamic(inner);
};
Easy.print = redis.print;

module.exports = Easy;
