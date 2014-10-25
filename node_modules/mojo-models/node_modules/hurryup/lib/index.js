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

  var timeout = options.timeout || 1000 * 20;

  //retry if an error.
  //can be a boolean, or a function that returns a boolean.
  var retry = options.retry || false;
  var retryIsFunction = !!(retry.constructor && retry.call && retry.apply) // from underscore.js

  //time gap between retries
  var retryTimeout = options.retryTimeout || 3000;



  return function() {

    var args = Array.prototype.slice.call(arguments, 0),
    killed   = false,
    oldNext,
    ret,
    self = this == global ? {} : this;


    if(typeof args[args.length - 1] == "function") {
      oldNext = args.pop();
    } else {
      oldNext = function(err) {
        if(err) throw err;
      }
    }

    var retryTimeout,
    ret,
    callbackErr,
    killDate = Date.now() + timeout,
    //start the race between the timed callback, and the kill timeout
    killTimeout = setTimeout(function() {

      ret.dispose();

      //uh oh - timed callback took too long! time to throw an error
      oldNext.call(self, callbackErr || new comerr.Timeout());

    }, timeout);


    function runCallback() {

      this._timeLeft = killDate - Date.now();


      //call the timed callback
      timedCallback.apply(this, args.concat(function(err) {

        //do not run the callback
        if(killed) return;

        if(err && retry && (!retryIsFunction || retry(err))) {
          callbackErr = err;
          return retryTimeout = setTimeout(runCallback, retryTimeout);
        }

        //awesome - made it before the killTimeout could
        clearTimeout(killTimeout);

        //pass on the args
        oldNext.apply(this, arguments);
      }));
    }


    runCallback.call(self);

    return ret = {
      dispose: function () {
        killed = true;
        clearTimeout(retryTimeout);
        clearTimeout(killTimeout);
      }
    };
  }
}

