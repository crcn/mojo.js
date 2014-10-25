var toarray = require("toarray"),
async       = require("async");

module.exports = {
  test: function (route) {
    return route.options.redirect;
  },
  decorate: function (route) {

    var redirect = route.options.redirect;

    route.mediator.on("post enter", function (message, next) {
      message.data.redirect(redirect, next);
    });
  }
}
