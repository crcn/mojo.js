define(["require", "underscore", "bindable", "mannequin/lib/transformers/index", "isa", "dref"], function(require) {

    var __dirname = "mannequin/lib",
    __filename    = "mannequin/lib/model.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports,
    global        = window;

    

    // Generated by CoffeeScript 1.6.2
(function() {
  var Model, Transformers, bindable, dref, isa, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require("underscore");

  bindable = require("bindable");

  Transformers = require("mannequin/lib/transformers/index");

  isa = require("isa");

  dref = require("dref");

  module.exports = Model = (function(_super) {
    __extends(Model, _super);

    /*
    */


    function Model(data, options) {
      if (data == null) {
        data = {};
      }
      if (options == null) {
        options = {};
      }
      Model.__super__.constructor.call(this, {});
      _.extend(this, options);
      this.set(data);
      this.init();
    }

    /*
    */


    Model.prototype.init = function() {
      return this.builder.initModel(this);
    };

    /*
    */


    Model.prototype.transform = function(key, transformer) {
      return transformer = this._transformer().use(key, transformer);
    };

    /*
    */


    Model.prototype.validate = function(callback) {
      if (!this.schema) {
        return callback();
      }
      return this.schema.test(this, callback);
    };

    /*
    */


    Model.prototype.get = function(key) {
      if (arguments.length === 0) {
        return Model.__super__.get.call(this, key);
      }
      if (this._virtual[key]) {
        return this._virtual[key].call(this);
      }
      return Model.__super__.get.call(this, key);
    };

    /*
    */


    Model.prototype._set = function(key, value) {
      if (this._virtual[key]) {
        return this._virtual[key].call(this, value);
      }
      return Model.__super__._set.call(this, key, this._transform(key, value));
    };

    /*
    */


    Model.prototype.toJSON = function() {
      return this._toJSON(this);
    };

    /*
    */


    Model.prototype._toJSON = function(data) {
      var definition, newData, v, _i, _id, _len, _ref;

      newData = {};
      _ref = this.schema.definitions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        definition = _ref[_i];
        v = data.__isBindable ? data.get(definition.key) : dref.get(data, definition.key);
        if (v === void 0) {
          continue;
        }
        dref.set(newData, definition.key, v);
      }
      _id = data.__isBindable ? data.get("_id") : dref.get(data, "_id");
      if (_id) {
        newData._id = _id;
      }
      return newData;
    };

    /*
    */


    Model.prototype._transform = function(key, value) {
      if (!this.__transformer) {
        return value;
      }
      return this.__transformer.set(key, value);
    };

    /*
    */


    Model.prototype._transformer = function() {
      return this.__transformer || (this.__transformer = new Transformers(this));
    };

    return Model;

  })(bindable.Object);

}).call(this);


    return module.exports;
});