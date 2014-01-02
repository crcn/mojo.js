var protoclass   = require("protoclass"),
loaf             = require("loaf"),
SubindableObject = require("subindable").Object,
janitor          = require("janitorjs"),
runlater         = require("runlater").global,
_                = require("underscore"),
generateId       = require("../../utils/idGenerator");


function DecorableView (data, application) {

  SubindableObject.call(this, this);

  this._onParent     = _.bind(this._onParent, this);
  this._removeLater  = _.bind(this._removeLater, this);
  this._disposeLater = _.bind(this._disposeLater, this);

  this.application = application;

  // ref back to this context for templates
  this["this"]     = this;

  // todo - should NOT have an ID
  if (data) {
    this._id = data._id ? data._id : data.model ? data.model.get("_id") : generateId();
  } else {
    this._id = generateId();
  }

  this.initialize(data);
}

protoclass(SubindableObject, DecorableView, {

  /**
   */

  __isView: true,

  /**
   */

  define: ["sections", "states"],

  /**
   */

  disposable: function (disposable) {

    if (!this._janitor) {
      this._janitor = janitor();
    }

    this._janitor.add(disposable);
  },

  /**
   */

  initialize: function (data) {

    // copy the data to this object. Note this shaves a TON
    // of time off initializing any view, especially list items if we
    // use this method over @setProperties data
    if (data) {
      for(var key in data) {
        this[key] = data[key];
      }
    }

    this.on("change:parent", this._onParent);
  },

  /**
   * returns the path to this view
   */

  path: function () {
    var path = [], cp = this;

    while (cp) { 
      path.unshift(cp.constructor.name);
      cp = cp.parent;
    }

    return path.join(".");
  },

  /**
   */

  render: function () {

    if (this._rendered) return this.section;
    this._rendered = true;

    if (!this.section) {
      this.section = loaf(this.application.nodeFactory);
      this.models  = this.application.models;
    }

    this._render(this.section);

    if (!this._decorated) {
      this._decorated = true;
      this.application.decorators.decorate(this, this.constructor.prototype);
    }

    this.emit("render");

    return this.section;
  },

  /**
   */

  _render: function (section) {
    // OVERRIDE ME
  },

  /**
   */

  remove: function () {
    if (this._rendered) {
      this._rendered = false;
      this.emit("remove");
      if (!this.parent || this.parent._rendered) {
        this.section.removeAll();
      }
    }
  },

  /**
   */

  $: function (search) {
    if (!this.section) return $();

    var el = $(this.section.getChildNodes());

    if (arguments.length) {
      return el.find(search)
    }

    return el;
  },

  /**
   * attaches to an element
   */

  attach: function (element) {
    var frag = this.render().toFragment();

    if (process.browser) {
      requestAnimationFrame(function () {
        (element[0] || element).appendChild(frag);
      });
    } else {
      (element[0] || element).appendChild(frag);
    }
  },

  /**
   */

  setChild: function (name, child) {
    child.set("parent", this);
    this.set("sections." + name, child)

    var self = this;
    child.once("dispose", function () {
      self.set("sections." + name, undefined);
    })
  },

  /**
   */

  decorate: function (options) {
    this.application.decorators.decorate(this, options);
    return this;
  },

  /**
   */

  dispose: function () {
    this.remove();
    if (this._janitor) this._janitor.dispose();
    this._decorated = false;
    this.set("parent", undefined);
    SubindableObject.prototype.dispose.call(this);
  },

  /**
   */

  bubble: function () {
    this.emit.apply(this, arguments);
    if(this.parent) this.parent.bubble.apply(this.parent, arguments);
  },

  /**
   */

  _onParent: function (parent) {

    if (this._parentRemoveListener) this._parentRemoveListener.dispose();
    if (this._parentDIsposeListener) this._parentDIsposeListener.dispose();

    if (!parent) return;

    this.inherit("application");

    this._parentRemoveListener  = parent.on("remove", this._removeLater);
    this._parentDIsposeListener = parent.on("dispose", this._disposeLater);
  },

  /**
   */

  _removeLater: function () {
    var self = this;
    runlater(function () {
      self.remove();
    })
  },
  /**
   */

  _disposeLater: function () {
    var self = this;
    runlater(function () {
      self.dispose();
    })
  }
});

module.exports = DecorableView;