(function () {

  var _queue = [], _timeout, _waiting = false, _running = false;

  /**
   */

  function _interval (fn, ms) {

    var timeout, disposed;

    function tick () {
      timeout = setTimeout(function () {
        _run(function () {

          if (disposed) return;

          fn();
          tick();
        })
      }, ms);
    }

    tick();

    return {
      dispose: function () {
        disposed = true;
        if(timeout) {
          clearTimeout(timeout);
        }
      }
    }
  }

  /**
   */

  function _run (fn) {
    _queue.push(fn);

    if (!_waiting) {
      _runQueue();
    }
  }

  /**
   */

  function _runQueue () {

    if (_running) return;
    _running = true;

    _waiting = false;
    _timeout = undefined;

    for (var i = 0; i < _queue.length; i++) {
      _queue[i]();
    }

    _running = false;

    _queue = [];
  }

  /**
   */

  function _wait () {
    _waiting = true;
    if (_timeout) clearTimeout(_timeout);
    _timeout = setTimeout(_runQueue, boo.waitTimeout);
  }

  /**
   */

  function _unwait () {
    if (_timeout) clearTimeout(_timeout);
    _runQueue();
  }

  /**
   */


  var boo = {
    interval    : _interval,
    run         : _run,
    wait        : _wait,
    unwait      : _unwait,
    waitTimeout : 1000
  };

  if (typeof process !== "undefined") {
    module.exports = boo;
  }

  if (typeof window !== "undefined") {
    window.boo = boo;

    $(document).ready(function () {

      $("body, html").

        // wait on scroll
        scroll(boo.wait).

        // wait on mouse down - TODO - should be on capture
        mousedown(boo.wait).

        // wait if the user is interacting with the page
        mousemove(boo.wait).

        // run when the user's mouse leaves the stage
        mouseleave(boo.unwait);
    });
  }


})();
