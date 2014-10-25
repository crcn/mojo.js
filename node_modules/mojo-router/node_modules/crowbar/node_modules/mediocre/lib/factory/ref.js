var type = require("type-component");

module.exports = {

  /**
   */

  test: function (options) {
    return type(options) === "string";
  },

  /**
   */

  create: function (options) {

    var mediator = options.mediator,
    ref          = options.listener;

    return function (message, next) {
      mediator.execute(message.child(ref), next);
    }
  }
};