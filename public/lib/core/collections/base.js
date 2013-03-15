// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["events", "underscore", "./binder"], function(events, _, Binder) {
    var BaseCollection;
    return BaseCollection = (function(_super) {

      __extends(BaseCollection, _super);

      /*
      */


      function BaseCollection(source) {
        BaseCollection.__super__.constructor.call(this);
        this._source = source || [];
      }

      /*
      */


      BaseCollection.prototype.clone = function(bind) {
        var clone;
        clone = new this.prototype.constructor();
        if (bind !== false) {
          this.bindTo(clone);
        }
        return clone;
      };

      /*
      */


      BaseCollection.prototype.bindTo = function(target) {
        new Binder(this, target);
        return this;
      };

      /*
      */


      BaseCollection.prototype.source = function(value) {
        if (value instanceof BaseCollection) {
          value.bindTo(this);
          return this;
        }
        if (!arguments.length) {
          return this._source.concat();
        }
        return this._emit("reset", {
          source: this._source = value
        });
      };

      /*
      */


      BaseCollection.prototype.addItem = function(item) {
        return this.addItemAt(item, this._source.length);
      };

      /*
      */


      BaseCollection.prototype.getItemAt = function(index) {
        return this._source[index];
      };

      /*
      */


      BaseCollection.prototype.addItemAt = function(item, index) {
        this._source.splice(index, 0, this._addItem(item));
        return this._emit("add", {
          item: item,
          index: index
        });
      };

      /*
      */


      BaseCollection.prototype.removeItem = function(item) {
        return this.removeItemAt(this._source.indexOf(item));
      };

      /*
      */


      BaseCollection.prototype.removeItemAt = function(index) {
        var item;
        if (!~index) {
          return false;
        }
        item = this._source[index];
        this._removeItem(item);
        this._source.splice(index, 1);
        return this._emit("remove", {
          item: item,
          index: index
        });
      };

      /*
      */


      BaseCollection.prototype.replaceItem = function(oldItem, newItem) {
        return this.replaceItemAt(this._source.indexOf(oldItem));
      };

      /*
      */


      BaseCollection.prototype.replaceItemAt = function(newItem, index) {
        var oldItem;
        if (!~index) {
          return false;
        }
        oldItem = this._source[index];
        this._source.splice(index, 1, this._addItem(newItem));
        return this._emit("replace", {
          oldItem: oldItem,
          newItem: newItem,
          index: index
        });
      };

      /*
      */


      BaseCollection.prototype._emit = function(type, data) {
        this.emit(type, data);
        return this.emit("updated", _.extend({
          type: type
        }, data));
      };

      /*
      */


      BaseCollection.prototype._addItem = function(item) {
        return item;
      };

      BaseCollection.prototype._removeItem = function(item) {
        return item;
      };

      return BaseCollection;

    })(events.EventEmitter);
  });

}).call(this);