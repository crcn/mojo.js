var toarray = require("toarray"),
async       = require("async"),
bindable    = require("bindable");

module.exports = {
  test: function (route) {
    return route.options.states;
  },
  decorate: function (route) {
    var states = route.options.states,
    router     = route.router;


    route.mediator.on("post enter", function (message, next) {

      if (!message.data.get("states")) {
        message.data.set("states", new bindable.Object());
      }

      for (var key in states) {
        message.data.set("states." + key, states[key]);
      }
      next();
    });
  }
}