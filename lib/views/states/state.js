var bindable = require("bindable"),
_            = require("underscore"),
protoclass   = require("protoclass");

function State (states, options, index) {

  this.states = states;
  this.select = _.bind(this.select, this);

  var ops = {};

  if (!options.viewClass && !options["class"]) {
    ops.viewClass = options;
  } else {
    ops = options;
  }

  ops.index    = index;
  ops.selected = false;
  ops._id      = options.name;

  bindable.Object.call(this, this);
  this.setProperties(ops);
}

protoclass(bindable.Object, State, {

  /**
   */

  select: function () {
    this.states.select(this);
  },

  /**
   */

  remove: function () {
    this._view.set("visible", false);
    this._view.dispose();
    this._view = undefined;
  },

  /**
   */

  render: function () {
    this._view.set("visible", true);
    return this._view.render();
  },

  /**
   */

  hasView: function () {
    return !!this._view;
  },

  /**
   */

  getView: function () {
    if (this._view) return this._view;
    var clazz = this.get("class") || this.get("viewClass");
    return this._view = new clazz();
  }
});

module.exports = State;