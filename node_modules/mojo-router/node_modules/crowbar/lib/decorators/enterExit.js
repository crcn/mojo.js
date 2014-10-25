var toarray = require("toarray"),
async       = require("async");

module.exports = {
  test: function (route) {
    return true;
  },
  decorate: function (route) {

    function wrapHandler (handlers) {
      return function (message, next) {
        if (!handlers.length) return next();
        var location = message.data;
        async.eachSeries(handlers, function (handler, next) {

          if (handler.length < 2) {
            handler(message.data);
            return next();
          }

          handler(message.data, next);
        }, next);
      };
    }

    route.mediator.on("enter", wrapHandler(toarray(route.options.enter)));
    route.mediator.on("exit", wrapHandler(toarray(route.options.exit)));
  }
}