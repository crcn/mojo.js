
var EventsDecorator   = require("./events"),
ChildrenDecorator     = require("./children"),
bindableDecorBindings = require("bindable-decor-bindings"),
frills                = require("frills");

module.exports = function (app) {
  
  var decor = frills();

  decor.
    priority("init", 0).
    priority("load", 1).
    priority("render", 2).
    priority("display", 3).
    use(
      bindableDecorBindings("render"),
      EventsDecorator,
      ChildrenDecorator
    );

  app.views.decorate = function (view, options) {
    decor.decorate(view, options);
  };

  app.views.decorator = function (decorator) {
    return decor.use(decorator);
  }
}
