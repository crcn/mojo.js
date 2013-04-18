define(["require", "events", "disposable"], function(require) {

    var __dirname = "bindable/lib/core",
    __filename    = "bindable/lib/core/eventEmitter.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports,
    global        = window;

    

    // Generated by CoffeeScript 1.6.2
(function() {
  var EventEmitter, disposable, events, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  events = require("events");

  disposable = require("disposable");

  module.exports = EventEmitter = (function(_super) {
    __extends(EventEmitter, _super);

    function EventEmitter() {
      _ref = EventEmitter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    /*
    */


    EventEmitter.prototype.on = function(key, listener) {
      var disposables, k, keys, listeners,
        _this = this;

      disposables = disposable.create();
      if (arguments.length === 1) {
        listeners = key;
        for (k in listeners) {
          disposables.add(this.on(k, listeners[k]));
        }
        return disposables;
      }
      keys = [];
      if (typeof key === "string") {
        keys = key.split(" ");
      } else {
        keys = key;
      }
      keys.forEach(function(key) {
        EventEmitter.__super__.on.call(_this, key, listener);
        return disposables.add(function() {
          return _this.off(key, listener);
        });
      });
      return disposables;
    };

    /*
    */


    EventEmitter.prototype.off = function(key, listener) {
      return this.removeListener(key, listener);
    };

    return EventEmitter;

  })(events.EventEmitter);

}).call(this);


    return module.exports;
});