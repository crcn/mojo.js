var type = require("type-component");

module.exports = {

  /**
   */

  test: function (options) {
    return type(options.listener) === "function";
  },

  /**
   */

  create: function (options) {
    var fn = options.listener;

    return function (message, next) {
      fn(message, function(err) {
        if(err) return next(err);
        var args = Array.prototype.slice.call(arguments, 1);
        if(args.length) {
          message.root.args = args;
        }
        next()
      });
    }
  }
};