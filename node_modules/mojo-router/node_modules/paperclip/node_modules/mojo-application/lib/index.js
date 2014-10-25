var bindable      = require("bindable"),
nofactor          = require("nofactor");

function Application (options) {
  if (!options) options = {};
  Application.parent.call(this, this);
  this.setProperties(options);
  this.nodeFactory = options.nodeFactory || nofactor["default"];
  this.models      = new bindable.Object();
  this._registerPlugins();

  var self = this;
}

module.exports = bindable.Object.extend(Application, {

  /**
   */

  plugins: [],

  /**
   */

  _registerPlugins: function () {

    var cp = this, parentPlugins = [];

    // inherit all plugins from the parent
    while (cp) {
      parentPlugins.push(cp.plugins || []);
      cp = cp.constructor.__super__;
    }


    for (var i = parentPlugins.length; i--;) {
      this.use.apply(this, parentPlugins[i]);
    }

    this.registerPlugins();
  },

  /**
   */

  registerPlugins: function () {

  },

  /**
   */

  willInitialize: function () {
    // OVERRIDE ME
  },

  /**
   */

  didInitialize: function () {
    // OVERRIDE ME
  },

  /**
   * Plugins to use for the mojo application.
   *
   * @method use
   * @param {Function} plugins... must be defined as `function (app) { }`
   */

  use: function () {

    // simple impl - go through each arg and pass self ref
    for(var i = 0, n = arguments.length; i < n; i++) {
      arguments[i](this);
    }

    return this;
  },

  /**
   */

  initialize: function () {
    
    if (this._initialized) throw new Error("cannot initialize application more than once");
    this._initialized = true;

    var args = Array.prototype.slice.call(arguments, 0);
    this.willInitialize.apply(this, args);
    this.emit.apply(this, ["initialize"].concat(args));
    this.didInitialize.apply(this, args);
  }
});


module.exports.main = new Application();