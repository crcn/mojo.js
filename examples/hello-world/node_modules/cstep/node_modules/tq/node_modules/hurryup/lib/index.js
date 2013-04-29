var comerr = require("comerr");

module.exports = function(timedCallback, timeoutOrOps) {

  var options = {};

  if(timeoutOrOps) {
    if(typeof timeoutOrOps == "object") {
      options = timeoutOrOps;
    } else {
      options = {
        timeout: timeoutOrOps
      };
    }
  }

  if(!options.timeout) options.timeout = 1000 * 20;

  //retry if an error
  if(!options.retry) options.retry = false;

  //time gap between retries
  if(!options.retryTimeout) options.retryTimeout = 3000;



  return function() {

    var args = Array.prototype.slice.call(arguments, 0),
    killed   = false,
    oldNext,
    self = this == global ? {} : this;


    if(typeof args[args.length - 1] == "function") {
      oldNext = args.pop();
    } else {
      oldNext = function(err) {
        if(err) throw err;
      }
    }

    var retryTimeout,
    callbackErr,
    killDate = Date.now() + options.timeout,
    //start the race between the timed callback, and the kill timeout
    killTimeout = setTimeout(function() {

      clearTimeout(retryTimeout);

      killed = true;

      //uh oh - timed callback took too long! time to throw an error
      oldNext.call(self, callbackErr || new comerr.Timeout());

    }, options.timeout);


    function runCallback() {

      this._timeLeft = killDate - Date.now();

      //call the timed callback
      timedCallback.apply(this, args.concat(function(err) {

        if(err && options.retry) {
          callbackErr = err;
          return retryTimeout = setTimeout(runCallback, options.retryTimeout);
        }

        //do not run the callback
        if(killed) return;

        //awesome - made it before the killTimeout could
        clearTimeout(killTimeout);

        //pass on the args
        oldNext.apply(this, arguments);
      }));
    }


    runCallback.call(self);
  }
}

