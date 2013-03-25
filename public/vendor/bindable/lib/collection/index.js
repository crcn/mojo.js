define(["require", "dref", "bindable/lib/collection/binding", "bindable/lib/core/eventEmitter", "isa", "hoist"], function(require) {

    var __dirname = "bindable/lib/collection",
    __filename    = "bindable/lib/collection/index.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports,
    global        = window;

    

    // Generated by CoffeeScript 1.4.0
(function() {
  var Binding, EventEmitter, dref, hoist, isa,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  dref = require("dref");

  Binding = require("bindable/lib/collection/binding");

  EventEmitter = require("bindable/lib/core/eventEmitter");

  isa = require("isa");

  hoist = require("hoist");

  /*
  */


  module.exports = (function(_super) {

    __extends(_Class, _super);

    /*
    */


    _Class.prototype.__isCollection = true;

    /*
    */


    function _Class(source) {
      if (source == null) {
        source = [];
      }
      this._length = 0;
      this._setDefaultIndexer();
      this.reset(source);
    }

    /*
    */


    _Class.prototype.length = function() {
      return this._length;
    };

    /*
    */


    _Class.prototype.source = function() {
      return this._source;
    };

    /*
    */


    _Class.prototype.reset = function(source) {
      if (!source) {
        source = [];
      }
      if (this._sourceBinding) {
        this._sourceBinding.dispose();
        this._sourceBinding = void 0;
      }
      if (source.__isCollection) {
        this._sourceBinding = source.bind().to(this);
        return this;
      }
      this._remove(this._source || []);
      this._insert(this._source = this._transform(source));
      return this;
    };

    /*
    */


    _Class.prototype.bind = function(to) {
      return new Binding(this).to(to);
    };

    /*
    */


    _Class.prototype.set = function(index, value) {
      return this.splice(index, 1, value);
    };

    /*
    */


    _Class.prototype.get = function(index) {
      return this.at(key);
    };

    /*
    */


    _Class.prototype.at = function(index) {
      return this._source[index];
    };

    /*
    */


    _Class.prototype.update = function(item) {};

    /*
    */


    _Class.prototype.remove = function(item) {
      var index;
      index = this.indexOf(item);
      if (!~index) {
        return false;
      }
      this.splice(index, 1);
      return true;
    };

    /*
    */


    _Class.prototype.filter = function(cb) {
      return this._source.filter(cb);
    };

    /*
    */


    _Class.prototype.splice = function(index, count) {
      var args, remove;
      args = Array.prototype.slice.call(arguments);
      args.splice(0, 2);
      args = this._transform(args);
      remove = this.slice(index, index + count);
      this._source.splice.apply(this._source, arguments);
      this._remove(remove, index);
      return this._insert(args, index);
    };

    /*
    */


    _Class.prototype.transform = function() {
      return this._transformer = hoist();
    };

    /*
    */


    _Class.prototype.slice = function(start, end) {
      return this._source.slice(start, end);
    };

    /*
    */


    _Class.prototype.indexOf = function(item) {
      return this._indexer(this._source, item);
    };

    /*
    */


    _Class.prototype.indexer = function(value) {
      if (!value) {
        return this._indexer;
      }
      this._indexer = value;
      return this;
    };

    /*
    */


    _Class.prototype._id = function(key) {
      var _this = this;
      return this.indexer(function(source, itemCheck) {
        var i, item, _i, _len;
        for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
          item = source[i];
          if (String(dref.get(item, key)) === String(dref.get(itemCheck, key))) {
            return i;
          }
        }
        return -1;
      });
    };

    /*
    */


    _Class.prototype.push = function() {
      var items;
      items = this._transform(Array.prototype.slice.call(arguments));
      this._source.push.apply(this._source, items);
      return this._insert(items, this._length);
    };

    /*
    */


    _Class.prototype.unshift = function() {
      var items;
      items = this._transform(Array.prototype.slice.call(arguments));
      this._source.unshift.apply(this._source, items);
      return this._insert(items);
    };

    /*
    */


    _Class.prototype.pop = function() {
      return this._remove([this._source.pop()], this._length);
    };

    /*
    */


    _Class.prototype.shift = function() {
      return this._remove([this._source.shift()], 0);
    };

    /*
    */


    _Class.prototype._setDefaultIndexer = function() {
      return this.indexer(function(source, item) {
        return source.indexOf(item);
      });
    };

    /*
    */


    _Class.prototype._insert = function(items, start) {
      var i, item, _i, _len, _results;
      if (start == null) {
        start = 0;
      }
      if (!items.length) {
        return;
      }
      this._length += items.length;
      _results = [];
      for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
        item = items[i];
        _results.push(this.emit("insert", item, start + i));
      }
      return _results;
    };

    /*
    */


    _Class.prototype._remove = function(items, start) {
      var i, item, _i, _len, _results;
      if (start == null) {
        start = 0;
      }
      if (!items.length) {
        return;
      }
      this._length -= items.length;
      _results = [];
      for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
        item = items[i];
        _results.push(this.emit("remove", item, start + i));
      }
      return _results;
    };

    /*
    */


    _Class.prototype._transform = function(item, index, start) {
      var i, results, _i, _len;
      if (!this._transformer) {
        return item;
      }
      if (isa.array(item)) {
        results = [];
        for (_i = 0, _len = item.length; _i < _len; _i++) {
          i = item[_i];
          results.push(this._transformer(i));
        }
        return results;
      }
      return this._transformer(item);
    };

    return _Class;

  })(EventEmitter);

}).call(this);


    return module.exports;
});