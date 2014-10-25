var _asyncCount = 0;

function flatstack(options) {

  if(!options) {
    options = {};
  }

  var _context = options.context,
  _parent      = options.parent,
  _asyncLength = options.asyncLength || 1,
  enforceAsync = !!(options.enforceAsync || module.exports.enforceAsync);



  var _queue = [], _error = function(err) {
  
  }

  var self = {

    /**
     */

    _parent: _parent,


    /**
     */

    _pauseCount: 0,

    /**
     */

    error: function(callback) {
      _error = callback;
    },

    /**
     */

    child: function(context) {
      return flatstack({
        context     : _context,
        parent      : _parent,
        asyncLength : _asyncLength
      });
    },

    /**
     */

    pause: function() {
      
      var p = self;

      while(p) {
        p._pauseCount++;
        p = p._parent;
      }

      return self;
    },

    /**
     */

    resume: function(err) {

      if(err) _error(err);

      //already resumed? ignore!
      if(!self._pauseCount || self._resuming) return self;

      self._resuming = true;


      //if the queued function called for .pause() and .resume()
      //maintain the async behavior by adding a timeout - it's expected!
      if(enforceAsync && _asyncCount++ == flatstack.asyncLimit) {
        _asyncCount = 0;
        setTimeout(self._resume, 0, arguments);
      } else {
        self._resume(arguments);
      }

      return self;
    },

    /**
     */

    _resume: function(args) {
      var p = self;
      self._resuming = false;

      //first decrmeent the pause count
      while(p) {
        p._pauseCount--;
        p = p._parent;
      }

      p = self;


      //next, resume eveything
      while(p) {
        if(p._pauseCount) break;
        p.next(args);
        p = p._parent;
      }
    },

    /**
     */

    push: function() {
      _queue.push.apply(_queue, arguments);
      self._run();
      return self;
    },

    /**
     */

    unshift: function() {
      _queue.unshift.apply(_queue, arguments);
      self._run();
      return self;
    },

    /**
     */

    next: function() {

      var args = Array.prototype.slice.call(arguments[0] || [], 0);

      var fn, context, ops;

      while(_queue.length) {

        //paused? stop for now
        if(self._pauseCount) break;

        ops = _queue.shift();

        context = ops.context || _context;
        fn      = ops.fn      || ops;

        //argument provided? it's asynchronous
        //also check if the function is async - might be looking for
        //arguments
        if(fn.length === _asyncLength || fn.async) {
          args.unshift(self.pause().resume);
          fn.apply(context, args);
        } else {
          fn.apply(context, args);
        }
      }

      if(self._complete && !_queue.length && !self._pauseCount) {
        self._complete();

        //can ONLY be called once - dispose of this.
        self._complete = undefined;
      }

    },

    /**
     */

    complete: function(fn) {

      self._complete = fn;

      //just need to get to the ._complete() logic
      if(!_queue.length) return self.next();
    },

    /**
     */

    _run: function() {
      if(self._pauseCount || !_queue.length) return;
      self.next();
    }
  };

  return self;
}

flatstack.asyncLimit = 10;
module.exports = flatstack;