var bindable      = require("bindable"),
_                 = require("underscore"),
type              = require("type-component"),
paperclip         = require("mojo-paperclip"),
nofactor          = require("nofactor"),
protoclass        = require("protoclass"),
pools             = require("./pools"),
animator          = require("mojo-animator"),
RegisteredClasses = require("./registeredClasses"),

defaultComponents = require("./plugins/defaultComponents"),
decorators        = require("./plugins/decor");


/**
 * @module mojo
 */

/**

Main entry point to your mojo application. The application is an access point to other parts of the application,
such as a third-party `mediator`, `router`, `models`, and `views` (note mojo only comes with the `view` by default). It also keeps your mojo application from polluting the global
scope.

### Example

```javascript

// load in mojo, browserify will make it accessible from the web.
var mojo = require("mojo");

// create the app
var app = new mojo.Application();

// point to the views to
app.use(require("./views"));

// create the main view, then attach to a DOM element.
app.viewClasses.create("main").attach($("#application"));
```

views.js

```javascript
module.exports = function (app) {
  app.viewClasses.add("main", mojo.View.extend({
      paper: paperclip.compile("hello")
  }));
}
```

Here's what you get:

<iframe width="100%" height="300" src="http://jsfiddle.net/BZA8K/58/embedded/result,js,html" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

@class Application
@param {Object} options
@extends BindableObject
*/



function Application (options) {

  if (!options) options = {};

  Application.parent.call(this, this);

  /**
   * The node factory to use. Changes depending on the platform.
   * @property nodeFactory
   * @type BaseNodeFactory
   */

  this.nodeFactory = options.nodeFactory || nofactor["default"];

  /**
   * Where all the instantiated models live.
   * @property models
   * @type BindableObject
   */

  this.models      = new bindable.Object();

  /**
   * TRUE if testing mode
   * @property fake
   * @type {Boolean}
   */

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

  // default plugins to use for every mojo application
  this.use(animator, defaultComponents, decorators, paperclip, pools.plugin);
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
