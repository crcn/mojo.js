// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(["disposable"], function(disposable) {
    var Glue;
    return Glue = (function() {
      /*
      */

      function Glue(from, fromProperty, to, toProperty) {
        this.from = from;
        this.fromProperty = fromProperty;
        this.to = to;
        this.toProperty = toProperty;
        this._onFromChange = __bind(this._onFromChange, this);

        this._disposable = disposable.create();
        this._disposable.add(from.bind(fromProperty, this._onFromChange));
      }

      /*
      */


      Glue.prototype.bothWays = function() {
        if (this._gluedBothWays) {
          return;
        }
        this._gluedBothWays = true;
        this._disposable.add(to.bind(toProperty, this._onToChange));
        return this;
      };

      /*
      */


      Glue.prototype._onFromChange = function(value) {
        if (this.to.get(this.toProperty) !== value) {
          return this.to.set(this.toProperty, value);
        }
      };

      /*
      */


      Glue.prototype._onToChange = function(value) {
        if (this.from.get(this.fromProperty) !== value) {
          return this.from.set(this.fromProperty, value);
        }
      };

      /*
      */


      Glue.prototype.dispose = function() {
        return this._disposable.dispose();
      };

      return Glue;

    })();
  });

}).call(this);
