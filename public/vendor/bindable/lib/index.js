define(["require", "/vendor/dref/lib/index.js", "/vendor/bindable/lib/core/eventEmitter.js", "/vendor/bindable/lib/binding.js", "/vendor/bindable/lib/shim/dref.js"], function(require) {

    var __dirname = "/vendor/bindable/lib",
    __filename    = "/vendor/bindable/lib/index.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports;

    

    // Generated by CoffeeScript 1.4.0
(function() {
  var Binding, EventEmitter, dref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  dref = require("/vendor/dref/lib/index.js");

  EventEmitter = require("/vendor/bindable/lib/core/eventEmitter.js");

  Binding = require("/vendor/bindable/lib/binding.js");

  dref.use(require("/vendor/bindable/lib/shim/dref.js"));

  module.exports = (function(_super) {

    __extends(_Class, _super);

    /*
    */


    function _Class(data) {
      this.data = data != null ? data : {};
      _Class.__super__.constructor.call(this);
    }

    /*
    */


    _Class.prototype.get = function(key) {
      return this._ref(this.data, key) || this._ref(this, key);
    };

    /*
    */


    _Class.prototype.has = function(key) {
      return !!this.get(key);
    };

    /*
    */


    _Class.prototype.set = function(key, value) {
      var k;
      if (arguments.length === 1) {
        for (k in key) {
          this.set(k, key[k]);
        }
        return;
      }
      if (value && value.__isBinding) {
        value.to(this, key);
        return;
      }
      dref.set(this.data, key, value);
      this.emit("change:" + key, value);
      return this.emit("change", value);
    };

    /*
    */


    _Class.prototype._ref = function(context, key) {
      if (!key) {
        return context;
      }
      return dref.get(context, key);
    };

    /*
    */


    _Class.prototype.bind = function(property, to) {
      if (to && to.__isBinding) {
        this.set(property, to);
        return;
      }
      return new Binding(this, property).to(to);
    };

    return _Class;

  })(EventEmitter);

  module.exports.EventEmitter = EventEmitter;

}).call(this);


    return module.exports;
});