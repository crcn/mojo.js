var protoclass = require("protoclass");

/**
 * @module mojo
 * @submodule mojo-core
 */

/**
 * Animator that makes changes to the UI state of the application. Prevents layout thrashing.
 *
 * @class Animator
 */

function Animator () {
  this._animationQueue = [];
}

protoclass(Animator, {

  /**
   * Runs animatable object on requestAnimationFrame. This gets
   * called whenever the UI state changes.
   *
   * @method animate
   * @param {Object} animatable object. Must have `update()`
   */

  animate: function (animatable) {

    // if not browser, or fake app
    if (!process.browser) {
      return animatable.update();
    }

    // push on the animatable object
    this._animationQueue.push(animatable);

    var self = this;

    // if animating, don't continue
    if (this._requestingFrame) return;
    this._requestingFrame = true;
    var self = this;

    function runAnimations () {

      var queue = self._animationQueue;
      self._animationQueue = [];

      // queue.length is important here, because animate() can be
      // called again immediately after an update
      for (var i = 0; i < queue.length; i++) {
        queue[i].update();

        // check for anymore animations - need to run
        // them in order
        if (self._animationQueue.length) {
          runAnimations();
        }
      }
    }

    // run the animation frame, and callback all the animatable objects
    requestAnimationFrame(function () {
      runAnimations();
      self._requestingFrame = false;
    });
  }
});

module.exports = Animator;
