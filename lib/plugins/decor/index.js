
var EventsDecorator   = require("./events"),
SectionsDecorator     = require("./sections"),
bindableDecorBindings = require("bindable-decor-bindings"),
factory               = require("./factory");

module.exports = function (app) {
  var decor = factory();
    decor.
      priority("load", 0).
      priority("render", 1).
      priority("display", 2).
      use(
        bindableDecorBindings("render"), 
        EventsDecorator, 
        SectionsDecorator
      );

  app.decorators = decor;
  app.decorator = function (decorator) {
    return decor.use(decorator);
  }
}