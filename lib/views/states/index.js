var bindable = require("bindable")
State        = require("./state"),
protoclass   = require("protoclass"),
BaseView     = require("../base"),
_            = require("underscore"),
flatstack    = require("flatstack");

/**
 * @module mojo
 * @submodule mojo-views
 */

/**

@class StateView
@extends BaseView
*/

function StateView (data, application) {
  BaseView.call(this, data, application);
}


protoclass(BaseView, StateView, {

  /**
   * prevent states from being decorated
   */

  _decorated: true,

  /**
   * Transitions from one state to another
   * @param {BaseView} from view to transition from. This can be null.
   * @param {BaseView} to view to transition to.
   * @param {Function} complete called when the transition finishes
   */

  transition: function (from, to, next) {
    next()
  },

  /**
   */

  define: [

    /**
     * current state name
     * @property currentName
     */

    "currentName",

    /**
     * current state index
     * @property index
     */

    "index",

    /**
     * TODO - change this to 'states'
     */

    "source",

    /**
     * The current view being displayed
     * @property currentView
     * @type {BaseView}
     */

    "currentView",

    "rotate",
    "ended",

    /**
     * The collection of view classes to use
     * @property views
     * @type {Array}
     */

    "views"
  ],

  /**
   */

  ended: false,

  /**
   */

  initialize: function (data) {
    this.source = new bindable.Collection();
    BaseView.prototype.initialize.call(this, data);
    this._q = flatstack();

    this.next = _.bind(this.next, this);
    this.prev = _.bind(this.prev, this);

    this.bind("views", { to: _.bind(this._setViews, this) }).now();
  },

  /**
   */

  _setViews: function (views) {
    var self = this;
    this.source.reset(views.map(function (stateOptions, i) {
      return new State(self, stateOptions, i);
    }));

    if(this._rendered) {
      this._createBindings();
    }
  },

  /**
   */

  render: function () {
    var section = BaseView.prototype.render.call(this);
    this._createBindings();
    return section;
  },

  /**
   */

  _createBindings: function () {

    if (this._indexBinding) {
      this._indexBinding.dispose();
      this._cnameBinding.dispose();
    }

    this._indexbinding = this.bind("index", { to: _.bind(this._setIndexWithAnimation, this) }).now();
    this._cnameBinding = this.bind("currentName", { to: _.bind(this._setName, this) }).now();
  },

  /**
   * Selects a specific index
   * @method select
   * @param {Number} stateOrIndex
   */

  select: function (stateOrIndex) {
    if (typeof stateOrIndex === "number") {
      this.set("index", stateOrIndex);
    } else {
      var i = this.source.indexOf(stateOrIndex);
      if (~i) {
        this.select(i);
      }
    }
  },

  /**
   * moves to the next state
   * @method next
   */

  next: function () {
    this.move(1);
  },

  /**
   * moves to the previous state
   * @method prev
   */

  prev: function () {
    this.move(-1);
  },

  /**
   * moves to a specific state index
   * @method move
   * @param position steps to move. Can be something like `-1`, or `1`.
   */

  move: function (position) {
    var newIndex = this.index + position;

    if (newIndex < 0) {
      if (this.rotate) {
        newIndex = this.source.length - 1;
      } else {
        newIndex = 0;
        this.set("ended", true);
      }
    } else if (newIndex >= this.source.length) {
      if (this.rotate) {
        newIndex = 0;
      } else {
        newIndex = this.source.length - 1;
        this.set("ended", true);
      }
    }

    this.set("index", newIndex);
  },

  /**
   */

  _setName: function (name) {
    if (!name) return;
    for (var i = this.source.length; i--;) {
      var state = this.source.at(i);
      if (state.get("name") === name) {
        this.set("index", i);
        break;
      }
    }
  },

  /**
   */

  _setIndexWithAnimation: function () {
    this.application.animate(this);
  },

  /**
   */

  update: function () {
    if (!this.source.length) return;

    var self = this;


    var cs = this.currentState,
    os = cs;

    if (cs) cs.set("selected", false);

    var self     = this,
    state        = cs = this.currentState = this.source.at(Number(this.index || 0)),
    isNew        = !state.hasView(),
    newStateView = state.getView();

    if (cs === os) {
      return;
    }

    this.setChild("currentChild", newStateView);
    cs.set("selected", true);

    if (this._displayListener) this._displayListener.dispose();

    state.render();

    if (isNew) {
      self.section.append(newStateView.section.render());
    }

    function onTransition () {
      if (os && os !== cs) os.removeLater();

      self.set("currentView", newStateView);
    }

    if (!os) {
      this.transition(os ? os._view : os, state._view, function () {
        self.application.animate({ update: onTransition })
      });
    } else {
      onTransition();
    }

  }
});


module.exports = StateView;
