var protoclass = require("protoclass");

/**
 * Collection of registered classes that can be used throughout the mojo applicaiton (views/models).
 * @module mojo
 * @class RegisteredClasses
 */

function RegisteredClasses (application) {
  this.application = application;
  this._classes    = {};
}


protoclass(RegisteredClasses, {

  /**
   * Returns a registered class
   * @method get
   * @param {String} name
   */

  get: function (name) {
    return this._classes[name];
  },

  /**
   * Registers a class
   * @method add
   * @param {String} name
   * @param {Class} clazz the view / model class
   */

  add: function (name, clazz) {
    this._classes[name] = clazz;
  },

  /**
   * Creates a new object. 
   * Note that `application` is passed in the second constructor param of the instantiated class.

   * @method create
   * @param {String} name
   * @param {Object} options to pass as the first param in the constructor
   */

  create: function (name, options) {
    var clazz = this._classes[name];
    if (!clazz) throw new Error(name + " doesn't exist");
    return new clazz(options, this.application);
  }
});

module.exports = RegisteredClasses;