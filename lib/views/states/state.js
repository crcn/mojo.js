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
    this.view.set("visible", false);
    this.view.dispose();
    this.view = undefined;
  },

  /**
   */

  render: function () {
    this.view.set("visible", true);
    return this.view.render();
  },

  /**
   */

  hasView: function () {
    return !!this.view;
  },

  /**
   */

  getView: function () {
    if (this.view) return this.view;
    var clazz = this.get("class") || this.get("viewClass");
    return this.view = new clazz();
  }
});

module.exports = State;