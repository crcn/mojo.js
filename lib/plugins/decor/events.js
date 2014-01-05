var protoclass = require("protoclass"),
janitor        = require("janitorjs"),
_              = require("underscore");


function EventsDecorator (view, events) {
  this.view    = view;
  this.events = events;

  this.render = _.bind(this.render, this);
  this.remove = _.bind(this.remove, this);

  view.once("render", this.render);
  view.once("dispose", this.remove);
}



protoclass(EventsDecorator, {

  /**
   */

  render: function () {
    e = this._events();
    this._disposeBindings();
    this._janitor = janitor();

    for (var selector in e) {
      this._addBinding(selector, e[selector]);
    }
  },

  /**
   */

  remove: function () {
    this._disposeBindings();
  },

  /**
   */

  _addBinding: function (selector, viewMethod) {

    var selectorParts = selector.split(" "),
    actions           = selectorParts.shift().split(/\//g).join(" "),
    selectors         = selectorParts.join(","),
    self              = this,
    elements;

    // TODO - use JS traverse instead
    function cb () {
      var ref;
      if (typeof viewMethod === "function") {
        ref = viewMethod;
      } else {
        ref = self.view.get(viewMethod);
      }

      ref.apply(self.view, arguments);
    }

    if (!selectors.length) {
      elements = this.view.$();
    } else {
      elements = this.view.$(selectors);
    }

    elements.bind(lowerActions = actions.toLowerCase(), cb);


    actions.split(" ").forEach(function (action) {
      self._janitor.add(self.view.on(action, function() {
        cb.apply(self, [$.Event(action)].concat(Array.prototype.slice.call(arguments)));
      }));
    });

    this._janitor.add(function () {
      elements.unbind(lowerActions, cb);
    });
  },

  /**
   */

  _disposeBindings: function () {
    if (!this._janitor) return;
    this._janitor.dispose();
    this._janitor = undefined;
  },

  /**
   */

  _events: function () { 
    return this.events;
  }
});

EventsDecorator.priority   = "display";
EventsDecorator.getOptions = function (view) {
  return view.events;
}
EventsDecorator.decorate   = function (view, options) {
  return new EventsDecorator(view, options);
}

module.exports = EventsDecorator;