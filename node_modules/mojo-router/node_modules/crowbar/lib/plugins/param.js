var async = require("async")

module.exports = function (router) {

  var paramHandlers = {};

  router.param = function (name, fn) {
    paramHandlers[name] = fn;
    fn.paramName = name;
  }

  router.routes.decorators.add({
    test: function (route) {
      return !!route.params.length;
    },
    decorate: function (route) {

      var phandlers = route.params.map(function (name) {
        return paramHandlers[name];
      }).filter(function (h) {
        return !!h;
      });

      if (!phandlers.length) return;

      route.mediator.on("pre enter", function (message, next) {
        async.eachSeries(phandlers, function (handler, next) {

          var location = message.data,
          keyName      = "params." + handler.paramName;

          handler(location, function (err, value) {

            if (err) return next(err);
            if (value != null) {
              location.set(keyName, value);
            }

            next();
          });
        }, next);
      });
    }
  });
}
