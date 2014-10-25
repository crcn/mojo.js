var frills   = require("frills"),
virtuals     = require("./virtuals"),
crud         = require("./crud"),
bindings     = require("bindable-decor-bindings");

module.exports = function (app) {
  var decor = frills();

  decor.
  priority("init", 1).
  priority("load", 2).
  use(virtuals, crud, bindings());

  app.models.decorator = function (decorator) {
    decor.use(decorator);
  };

  app.models.decorate = function (target, proto) {
    decor.decorate(target, proto);
  };
};