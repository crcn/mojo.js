var type = require("type-component"),
async    = require("async");

module.exports = {

  /**
   */

  test: function (options) {
    return type(options.listener) === "object";
  },

  /**
   */

  create: function (options) {

    var refs = Object.keys(options.listener),
    mediator = options.mediator;


    return function (message, next) {
      async.eachSeries(refs, function (ref, next) {
        mediator.execute(message.child(ref, options.listener[ref]), next);
      }, next);
    }
  }
}