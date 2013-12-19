var protoclass = require("protoclass");


function DecorFactory () {
  this._priorities   = {};
  this._decorators   = [];
}

protoclass(DecorFactory, {

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

    if (!proto.__decorators || proto.__decorOwner != proto) {
      this._setDecorators(proto);
    }

    for(var i = proto.__decorators.length; i--;) {
      var d = proto.__decorators[i];
      d.decorator.decorate(target, d.options);
    }


    
  },


  /**
   */

  _setDecorators: function (proto) {


    var c = proto, d, dec, ops, decorators = proto.__decorators = [], used = {};

    proto.__decorOwner = proto;

    while(c) {

      for (var i = this._decorators.length; i--;) {
        d = this._decorators[i];

        if (used[i] && d.multi === false) continue;

        if ((ops = d.getOptions(c)) != null) {
          decorators.push({
            decorator: d,
            options: ops
          });
          used[i] = true;
        }
      }

      c = c.constructor.__super__;
    }
  }
});

module.exports = function () {
  return new DecorFactory();
}