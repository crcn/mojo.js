
var EventsDecorator   = require("./events"),
SectionsDecorator     = require("./sections"),
bindableDecorBindings = require("bindable-decor-bindings"),
factory               = require("./factory");

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

module.exports = decor;
module.exports.decorator = function (decorator) {
  return decor.use(decorator);
}