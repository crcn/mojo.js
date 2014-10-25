var protoclass = require("protoclass"),
defaultDecorators = [
  require("./parentEnterExit"),
  require("./enterExit"),
  require("./states"),
  require("./redirect")
];

function Decorators () {
  this._decorators = defaultDecorators.concat();
}


protoclass(Decorators, {
  add: function (decorator) {
    this._decorators.push(decorator);
    this._resort();
  },
  decorate: function (route) {

    for (var i = this._decorators.length; i--;) {
      var decorator = this._decorators[i];
      if (decorator.test(route)) {
        decorator.decorate(route);
      }
    }

    return route;
  },
  _resort: function () {
    this._decorators = this._decorators.sort(function (a, b) {
      return a.priority > b.priority ? -1 : 1;
    });
  }
});

module.exports = Decorators;
