var Message        = require("./message"),
factory            = require("./factory"),
listenerCollection = require("./factory/collection"),
type               = require("type-component"),
async              = require("async"),
protoclass         = require("protoclass"),
sift               = require("sift");

function Mediator () {
  this._listeners = {};
  this._spies     = [];
}


protoclass(Mediator, {

  /**
   */

  on: function (nameOrPlugin) {

    var listeners, nameParts, collection, listener;

    listeners = Array.prototype.slice.call(arguments, 1);

    if (nameOrPlugin.test) {
      return factory.push(nameOrPlugin);
    }

    nameParts = this._parse(nameOrPlugin);

    if(!(listener = this._listeners[nameParts.name])) {
      listener = this._listeners[nameParts.name] = { pre: [], post: [] };
    }

    listeners = factory.create(this, listeners);

    if(nameParts.type) {
      collection = listener[nameParts.type];
      collection.push(listeners);
    } else {
      listener.callback = listeners;
    }

    return {
      dispose: function () {
        var i;
        if (collection) {
          i = collection.indexOf(listeners);
          if(~i) {
            collection.splice(i, 1);
          }
        } else {
          delete this._listeners[nameParts.name];
        }
      }
    };
  },

  /**
   */

  spy: function (tester, listener) {
    this._spies.push({
      test     : sift(tester).test,
      listener : listener
    })
  },

  /**
   */

  _triggerSpies: function (message) {
    for (var i = this._spies.length; i--;) {
      var spy = this._spies[i];
      if (spy.test(message.data)) {
        spy.listener(message);
      }
    }
  },

  /**
   */

  message: function (name, data, options) {

    if(arguments.length === 2) {
      options = {};
    }

    return new Message(name, data || {}, options || {}, this);
  },

  /**
   */

  once: function (name) {
    var listeners, listener;

    listeners = Array.prototype. slice.call(arguments, 1);
    listeners.unshift(function (message, next) {
      listener.dispose();
      next();
    });

    return listener = this.on.apply(this, [name].concat(listeners));
  },

  /**
   */

  execute: function (nameOrMessage, data, next) {
    var msg, listener, chain;

    if (!nameOrMessage.__isCommand) {
      msg = this.message(nameOrMessage, data);
    } else {
      msg = nameOrMessage;
      next = data;
    }


    if (arguments.length === 2 && type(data) === "function") {
      next = data;
    }

    if (type(next) !== "function") {
        next = function () {};
    }

    listener = this._listeners[msg.name] || {};

    chain = (listener.pre || []).
      concat(listener.callback || []).
      concat(listener.post || []);

    msg.listeners = chain;

    this._triggerSpies(msg);

    msg.set("loading", true);

    function complete (err, result) {
      var args = arguments;
      async.nextTick(function () {
        if (err) {
           msg.set("error", err);
           return next(err);
        }

        msg.set("success", !err);
        msg.set("loading", false);
        msg.set("data", result);
        next.apply(this, args);
      });
    }


    if (!chain.length) {
      complete(new Error("command '"+ nameOrMessage + "' does not exist"));
      return msg;
    }


    var completeArgs = [];

    async.eachSeries(chain, function (l, next) {
      l(msg, function (err) {

        // fix for sinon
        if (!err && l === listener.callback) {
          completeArgs = msg.args.length ? [null].concat(msg.args) : Array.prototype.slice.call(arguments, 0);
        }
        next(err);
      });
    }, function (err) {
      if(err) return complete.apply(this, arguments);
      complete.apply(this, completeArgs);
    });

    return msg;
  },

  /**
   */

  _parse: function (message) {
    var messageParts = message.split(" "),
    name = messageParts.pop(),
    t = messageParts.pop(); // pre? post?

    return { type: t, name: name };
  }
});

module.exports = function () {
  return new Mediator();
}
