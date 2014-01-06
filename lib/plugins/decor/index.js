
var EventsDecorator   = require("./events"),
SectionsDecorator     = require("./sections"),
bindableDecorBindings = require("bindable-decor-bindings"),
factory               = require("./factory");

module.exports = function (app) {
  var decor = factory();
    decor.
      priority("init", 0).
      priority("load", 1).
      priority("render", 2).
      priority("display", 3).
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