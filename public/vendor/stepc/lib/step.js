define(["require"], function(require) {

    var __dirname = "stepc/lib",
    __filename    = "stepc/lib/step.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports,
    global        = window;

    

    /*
Copyright (c) 2010 Tim Caswell <tim@creationix.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Inspired by http://github.com/willconant/flow-js, but reimplemented and
// modified to fit my taste and the node.JS error handling system.
var slice = Array.prototype.slice;

function _Step(steps, context, ignoreReturn) {
  var counter, results, lock;

  // Define the main callback that's given as `this` to the steps.
  function next() {

    // Check if there are no steps left
    if (steps.length === 0) {
      // Throw uncaught errors
      if (arguments[0]) {
        throw arguments[0];
      }
      return;
    }

    // Get the next step to execute
    var fn = steps.shift();
    counter = 0;
    results = [];

    // Run the step in a try..catch block so exceptions don't get out of hand.
    try {
      lock = true;
      var result;

      // Argument preparation
      if (context === next) {
        result = fn.apply(context, arguments);
      }
      else {
        var args = slice.call(arguments);
        if (args.length === 0) args.push(null);
        if (fn.length === 0) {
          args.push(next);
        }
        else {
          if (args.length < fn.length) args[fn.length - 1 || 1] = next;
          else args.push(next);
        }
        result = fn.apply(context, args);
      }
    } catch (e) {
      // Pass any exceptions on through the next callback
      next(e);
    }


    // If a synchronous return is used, pass it to the callback
    if (result !== undefined && !ignoreReturn) {
      next(undefined, result);
    }
    lock = false;
  }

  // Add a special callback generator `this.parallel()` that groups stuff.
  next.parallel = function () {
    var i = counter;
    counter++;
    function check() {
      counter--;
      if (counter === 0) {
        // When they're all done, call the callback
        next.apply(null, results);
      }
    }
    return function () {
      // Compress the error from any result to the first argument
      if (arguments[0]) {
        results[0] = arguments[0];
      }
      // Send the other results as arguments
      results[i + 1] = arguments[1];
      if (lock) {
        process.nextTick(check);
        return
      }
      check();
    };
  };

  // Generates a callback generator for grouped results
  next.group = function () {
    var localCallback = next.parallel();
    var counter = 0;
    var result = [];
    var error = undefined;
    // Generates a callback for the group
    return function () {
      var i = counter;
      counter++;
      function check() {
        counter--;
        if (counter === 0) {
          // When they're all done, call the callback
          localCallback(error, result);
        }
      }
      return function () {
        // Compress the error from any result to the first argument
        if (arguments[0]) {
          error = arguments[0];
        }
        // Send the other results as arguments
        result[i] = arguments[1];
        if (lock) {
          process.nextTick(check);
          return
        }
        check();
      }

    }
  };

  if (!context) context = next;

  // Start the engine an pass nothing to the first step.
  next();
}

function Step() {

  var args = slice.call(arguments),
      context = args.length > 1 && typeof args[0] !== 'function'
        ? args.shift()
        : undefined;
  _Step(args, context, false);
}

Step.async = function () {

  var args = slice.call(arguments),
      context = args.length > 1 && typeof args[0] !== 'function'
        ? args.shift()
        : undefined;
  _Step(args, context, true);
};

// Tack on leading and tailing steps for input and output and return
// the whole thing as a function.  Basically turns step calls into function
// factories.
Step.fn = function StepFn() {
  var steps = Array.prototype.slice.call(arguments);
  return function () {
    var args = Array.prototype.slice.call(arguments);

    // Insert a first step that primes the data stream
    var toRun = [function () {
      this.apply(null, args);
    }].concat(steps);

    // If the last arg is a function add it as a last step
    if (typeof args[args.length-1] === 'function') {
      toRun.push(args.pop());
    }


    Step.apply(null, toRun);
  }
}


// Hook into commonJS module systems
if (typeof module !== 'undefined' && "exports" in module) {
  module.exports = Step;
}


    return module.exports;
});