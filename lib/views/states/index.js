var bindable = require("bindable")
State        = require("./state"),
protoclass   = require("protoclass"),
BaseView     = require("../base"),
_            = require("underscore");


function StateView (data, application) {
  BaseView.call(this, data, application);
}


protoclass(BaseView, StateView, {

  /**
   * prevent states from being decorated
   */

  _decorated: true,

  /**
   */

  define: ["currentName", 
    "index", 
    "source", 
    "currentView", 
    "rotate", 
    "ended", 
    "views"],

  /**
   */

  ended: false,

  /**
   */

  initialize: function (data) {
    this.source = new bindable.Collection();    
    BaseView.prototype.initialize.call(this, data);

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
   */

  next: function () {
    this.move(1);
  },

  /**
   */

  prev: function () {
    this.move(-1);
  },

  /**
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

    var cs = this.currentState,
    os = cs;

    if (cs) cs.set("selected", false);

    var self     = this,
    state        = cs = this.currentState = this.source.at(Number(this.index || 0)),
    isNew        = !state.hasView(),
    newStateView = state.getView();

    this.setChild("currentChild", newStateView);
    cs.set("selected", true);

    if (this._displayListener) this._displayListener.dispose();

    if (os && os !== cs) {
      os.remove();
    }

    state.render();

    if (isNew) {
      this.section.append(newStateView.section.render());
    }
    
    this.set("currentView", newStateView);
  }
});


module.exports = StateView;