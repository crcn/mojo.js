define(["require", "/vendor/mannequin/lib/utils.js", "/vendor/async/lib/async.js", "/vendor/mannequin/lib/propertyDefinition.js"], function(require) {

    var __dirname = "/vendor/mannequin/lib",
    __filename    = "/vendor/mannequin/lib/schema.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports;

    

    // Generated by CoffeeScript 1.4.0
(function() {
  var PropertyDefinition, Schema, async, utils;

  utils = require("/vendor/mannequin/lib/utils.js");

  async = require("/vendor/async/lib/async.js");

  PropertyDefinition = require("/vendor/mannequin/lib/propertyDefinition.js");

  module.exports = Schema = (function() {
    /*
    */

    Schema.prototype.__isSchema = true;

    /*
    */


    function Schema(definition, options) {
      this.definition = definition;
      this.options = options;
      this.build();
    }

    /*
       validates an object against all definitions
    */


    Schema.prototype.test = function(target, next) {
      return async.forEach(this.definitions, (function(definition, next) {
        return definition.test(target, next);
      }), next);
    };

    /*
       synonym for test
    */


    Schema.prototype.validate = function(target, next) {
      return this.test(target, next);
    };

    /*
    */


    Schema.prototype.build = function() {
      var flattenedDefinitions, key, _results;
      flattenedDefinitions = utils.flattenDefinitions(this.definition);
      this.definitions = [];
      _results = [];
      for (key in flattenedDefinitions) {
        _results.push(this.definitions.push(new PropertyDefinition(this, key, flattenedDefinitions[key])));
      }
      return _results;
    };

    return Schema;

  })();

}).call(this);


    return module.exports;
});