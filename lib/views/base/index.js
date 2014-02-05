var protoclass   = require("protoclass"),
loaf             = require("loaf"),
SubindableObject = require("subindable").Object,
janitor          = require("janitorjs"),
runlater         = require("runlater").global,
_                = require("underscore"),
decor            = require("../../plugins/decor"),
generateId       = require("../../utils/idGenerator");


function DecorableView (data, application) {

  SubindableObject.call(this, this);

  this._onParent     = _.bind(this._onParent, this);

  this.application = application;

  // ref back to this context for templates
  this["this"]     = this;

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

  reset: function (data) {

    // copy the data to this object. Note this shaves a TON
    // of time off initializing any view, especially list items if we
    // use this method over @setProperties data
    if (data) {
      for(var key in data) {
        this[key] = data[key];
      }
    }

    // necessary to properly dispose this view so it can be recycled
    if (this.parent) this._onParent(this.parent);
  },

  /**
   */

  initialize: function (data) {

    this._cid = generateId();

    this.on("change:parent", this._onParent);
    this.reset(data);

    if (this.application) this._initDecor();

  },

  /**
   */

  _initDecor: function () {

    if (!this.application) {
      throw new Error("application must be defined for view ", this.constructor.name);
    }

    this._decorated = true;

    if (!this.section) {
      this.section = loaf(this.application.nodeFactory);
      this.models  = this.application.models;
    }

    this.application.decorators.decorate(this, this.constructor.prototype);
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

    if (this._rendered) return this.section.render();
    this._rendered = true;

    if (!this._decorated)  this._initDecor();
    
    this._render(this.section.show());

    this.emit("render");

    return this.section.render();
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
        this.section.remove();
      }
    }
  },

  /**
   */

  $: function (search) {
    if (!this.section) return $();

    var el = $(this.section.getChildNodes());

    if (arguments.length) {
      return el.find(search).andSelf().filter(search);
    }

    return el;
  },

  /**
   * attaches to an element
   */

  attach: function (element) {
    var frag = this.render();

    if (process.browser) {
      this.application.animate({
        update: function () {
          (element[0] || element).appendChild(frag);
        }
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
    if (this._parentRemoveListener) this._parentRemoveListener.dispose();
    if (this._parentDisposeListener) this._parentDisposeListener.dispose();
    this._parentRemoveListener = undefined;
    this._parentDisposeListener = undefined;

    // need to pull the section out of the parent
    if (this.section) this.section.remove();
    if (this._janitor) this._janitor.dispose();
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
    if (this._parentDisposeListener) this._parentDisposeListener.dispose();

    if (!this._initParent) {
      this._initParent = true;
      this._removeLater  = _.bind(this._removeLater, this);
      this._disposeLater = _.bind(this._disposeLater, this);
    }

    if (!this.applicaton) this.inherit("application");

    if (!parent) return;

    this._parentRemoveListener  = parent.on("remove", this._removeLater);
    this._parentDisposeListener = parent.on("dispose", this._disposeLater);
  },

  /**
   */

  _removeLater: function () {
    var self = this;
    self.remove();
  },
  /**
   */

  _disposeLater: function () {
    var self = this;
    self.dispose();
  }
});

module.exports = DecorableView;