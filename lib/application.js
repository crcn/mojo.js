var bindable = require("bindable"),
_            = require("underscore"),
type         = require("type-component"),
paperclip    = require("mojo-paperclip"),
nofactor     = require("nofactor"),
protoclass   = require("protoclass"),
poolpaerty   = require("poolparty"),
pools        = require("./pools"),
Animator     = require("./animator"),
RegisteredClasses = require("./registeredClasses"),

defaultComponents = require("./plugins/defaultComponents"),
decorators        = require("./plugins/decor");


/**
 * Main entry point to your application. This is where everything is initialized.
 *
 * @module mojo
 * @class Application
 * @param {Object} options
 */



function Application (options) {
  if (!options) options = {};

  Application.parent.call(this, this);

  this.nodeFactory = options.nodeFactory || nofactor["default"];  
  this.models      = new bindable.Object();
  this.fake        = !!options.fake;

  /**
   * List of registered model classes
   * @property modelClasses
   * @type RegisteredClasses
   */

  this.modelClasses = new RegisteredClasses(this);

  /**
   * List of registered view classes
   * @property viewClasses
   * @type RegisteredClasses
   */

  this.viewClasses = new RegisteredClasses(this);

  // makes changes to the application view state.
  this._animator = new Animator(this);

  // default plugins to use for every mojo application
  this.use(defaultComponents, decorators, paperclip, pools.plugin);
}


protoclass(bindable.Object, Application, {

  /**
   * Plugins to use for the mojo application. 
   *
   * @method use
   * @param {Function} plugins... must be defined as `function (app) { }`
   */

  use: function (test) {

    // simple impl - go through each arg and pass self ref
    for(var i = 0, n = arguments.length; i < n; i++) {
      arguments[i](this);
    }

    return this;
  },

  /**
   * DEPRECATED
   */

  getViewClass: function (name) {
    return this.viewClasses.get(name);
  },

  registerViewClass: function (name, clazz) {
    return this.viewClasses.add(name, clazz);
  },

  createView: function (name, options) {
    return this.viewClasses.create(name, options);
  },

  /**
   * DEPRECATED
   */

  getModelClass: function (name) {
    return this.modelClasses.get(name);
  },
  registerModelClass: function (name, clazz) {
    return this.modelClasses.add(name, clazz);
  },
  createModel: function (name, options) {
    return this.modelClasses.create(name, options);
  },

  /**
   * Runs `update()` on requestAnimationFrame. Used whenever the UI changes.
   * @method animate
   * @param {Object} animatable Must have `update()` defined.
   * @see Animator
   */

  animate: function (animatable) {
    this._animator.animate(animatable);
  }
});

module.exports = Application;