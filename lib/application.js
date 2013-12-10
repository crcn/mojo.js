var bindable = require("bindable"),
_            = require("underscore"),
type         = require("type-component"),
paperclip    = require("mojo-paperclip"),
nofactor     = require("nofactor"),
protoclass   = require("protoclass"),

defaultComponents = require("./plugins/defaultComponents"),
decorators        = require("./plugins/decor");




function Application (options) {
  if (!options) options = {};

  Application.parent.call(this, this);

  this.nodeFactory = options.nodeFactory || nofactor["default"];  
  this.models      = new bindable.Object();

  this.use(defaultComponents, decorators, paperclip);
}


protoclass(bindable.Object, Application, {

  /**
   */

  use: function () {
    for(var i = 0, n = arguments.length; i < n; i++) {
      arguments[i](this);
    }
    return this;
  },

  /**
   */

  getViewClass: function (name) {
    return this.getClass("views." + name);
  },
  registerViewClass: function (name, clazz) {
    this.registerClass("views." + name, clazz);
  },
  createView: function (name, options) {
    return this.createObject("views." + name, options);
  },

  /**
   */

  getModelClass: function (name) {
    return this.getClass("models." + name);
  },
  registerModelClass: function (name, clazz) {
    this.registerClass("models." + name, clazz);
  },
  createModel: function (name, options) {
    return this.createObject("models." + name, options);
  },

  /**
   */

  getClass: function (name) {
    return this.get("models.classes." + name);
  },
  registerClass: function (name, clazz) {
    this.set("models.classes." + name, clazz);
  },
  createObject: function (name, options) {
    if (!options) options = {};

    if (type(name) === "function") {
      clazz = name;
    } else {
      clazz = this.get("models.classes." + name);

      if (!clazz) {
        throw new Error("class '"+name+"' doesn't exist");
      }
    }

    return new clazz(options, this);
  }

});

module.exports = Application;