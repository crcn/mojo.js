var collection,
factories = [
  require("./obj"),
  require("./fn"),
  require("./ref"),
  collection = require("./collection")
];

module.exports = {

  /**
   */

  push: function (factory) {
    factories.push(factory);
  },

  /**
   */

  create: function (mediator, listeners) {
    var tlisteners = [], listener, options, tester;

    for(var i = 0; i < listeners.length; i++) {
      listener = listeners[i];

      options = { mediator: mediator, listener: listener };

      for(var j = 0; j < factories.length; j++) {
        tester = factories[j];
        if (tester.test(options)) {
          tlisteners = tlisteners.concat(tester.create(options));
        }
      }
    }

    return collection.create({ mediator: mediator, listener: tlisteners });
  }
};