var protoclass = require("protoclass");


function DecorFactory () {
  this._priorities   = {};
  this._decorators   = [];
}

module.exports = protoclass(DecorFactory, {

  /**
   */

  priority: function (name, value) {
    this._priorities[name] = value;
    return this;
  },

  /**
   */

  use: function () {
    var p = this._priorities;
    this._decorators = this._decorators.concat(Array.prototype.slice.call(arguments, 0)).sort(function (a, b) {
      return p[a.priority] > p[b.priority] ? -1 : 1;
    });
  },

  /**
   */

  decorate: function (target, proto) {

    if (!proto) {
      proto = target.constructor.prototype;
      if (proto === Object.prototype) {
        proto = target;
      }
    }

    var c = proto, d, dec, ops, used = {};

    while(c) {

      for (var i = this._decorators.length; i--;) {
        d = this._decorators[i];

        if (used[i] && d.multi !== true) continue;

        if ((ops = d.getOptions(c)) != null) {
          d.decorate(target, ops);
          used[i] = true;
        } else if (d.inherit === false) {
          used[i] = true;
        }
      }

      c = c.constructor.__super__;
    }
  }
});
