var type = require("type-component"),
async    = require("async");

module.exports = {

  /**
   */

  test: function (options) {
    return type(options.listener) === "array";
  },

  /**
   */

  create: function (options) {

    if (options.listener.length === 1) {
      return options.listener[0];
    }

    return function (message, next) {
      async.eachSeries(options.listener, function (listener, next) {
        listener.call(this, message, next);
      }, next);
    }
  }
};