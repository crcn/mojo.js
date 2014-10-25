var protoclass     = require("protoclass"),
loaf               = require("loaf"),
SubindableObject   = require("subindable").Object,
janitor            = require("janitorjs"),
runlater           = require("runlater")(1, 100),
_                  = require("underscore"),
decor              = require("../../plugins/decor"),
noselector         = require("noselector");

/**
 * @module mojo
 * @submodule mojo-views
 */

/**
@class BaseView
@extends SubindableObject
*/

/**
 * Called when the view is rendered
 * @event render
 */

/**
 * Called when the view is remove
 * @event remove
 */


function BaseView (data, application) {

  SubindableObject.call(this);

  this._onParent     = _.bind(this._onParent, this);

  /**
   * The main application that instantiated this view
   * @property application
   * @type {Application}
   */

  // note that if application is not defined, this.application will
  // default to the default, global application.
  this.application = application;

  this.initialize(data);
  
  // ref back to this context for templates
  this["this"]     = this;
}

protoclass(SubindableObject, BaseView, {

  /**
   */

  visible: false,

  /**
   */

  _rendered: false,

  /**
   */

  __isView: true,

  /**
   */

  define: ["sections", "children"],

  /**
   * adds a disposable object to cleanup when the view is destroyed.
   * @method disposable
   * @param {Object} disposable Must have `dispose()` defined.
   */

  disposable: function (disposable) {

    if (!this._janitor) {
      this._janitor = janitor();
    }

    this._janitor.add(disposable);
  },

  /**
   * Called when the view is instantiated
   * @method initialize
   * @param {Object} options options passed when creating the view
   */

  initialize: function (data) {
    this.on("change:parent", this._onParent);

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

  _createSection: function () {

    if (this.section) return;

    if (!this.application) {
      this.application = global.application || BaseView.defaultApplication;
    }


    /**
     * The section that manages the `document fragment` owned by this view controller.
     * @property section
     * @type {Section}
     */

    this.section = loaf(this.application.nodeFactory);
    this.didCreateSection();
    this.models  = this.application.models;

    this.emit("decorate");

    this.application.views.decorate(this, this.constructor.prototype);
  },

  /**
   * Returns the path to the view
   * @method path
   */

  path: function () {
    var path = [], cp = this;

    while (cp) {
      path.unshift(cp.name || cp.constructor.name);
      cp = cp.parent;
    }

    return path.join(".");
  },

  /**
   * Renders the view
   * @method render
   * @return {Object} document fragment
   */

  render: function () {

    // if rendered, then just return the fragment
    if (this._rendered) {
      return this.section.render();
    }

    this._rendered = true;

    if (this._cleanupJanitor) {
      this._cleanupJanitor.dispose();
    }

    if (!this.section) {
      this._createSection();
    }

    this.willRender();
    this.emit("render");

    var fragment = this.section.render();

    this.didRender();
    this._updateVisibility();

    return fragment;
  },

  /**
   */

  didCreateSection: function () {
    // OVERRIDE ME
  },

  /**
   */

  willRender: function () {
    //OVERRIDE ME
  },

  /**
   */

  didRender: function () {
    //OVERRIDE ME
  },

  /**
   * Removes the view from the parent, or DOM
   * @method remove
   */

  remove: function () {

    if (!this._rendered) return;

    this.willRemove();
    this.emit("remove");
    this.section.remove();
    this.didRemove();

    this._rendered = false;
    this._updateVisibility();
  },

  /**
   */

  willRemove: function () {
    // OVERRIDE ME
  },

  /**
   */

  didRemove: function () {
    // OVERRIDE ME
  },

  /**
   * jquery selector for elements owned by the view
   * @method $
   * @param {String} selector
   */

  $: function (search) {
    if (!this.section) this.render();

    var el = noselector(this.section.getChildNodes());

    if (arguments.length) {
      return el.find(search).andSelf().filter(search);
    }

    return el;
  },

  /**
   * Sort of a mix-in for the view. This is how `sections`, and `events` are added.
   * @method decorate
   * @param options
   * @returns {Object} this
   */

  decorate: function (options) {
    this._createSection();
    this.application.views.decorate(this, options);
    return this;
  },

  /*
   */

  dispose: function () {

    // first detach the view from the parent
    this.remove();

    // detach from the parent
    this.set("parent", void 0);

    // remove all disposable items attached to this view
    if (this._janitor) this._janitor.dispose();


    SubindableObject.prototype.dispose.call(this);
  },

  /**
   * Bubbles an event up to the root view
   * @method bubble
   * @param {String} name of the event
   * @param {Object} params... additional params
   */

  bubble: function () {
    this.emit.apply(this, arguments);
    if(this.parent) this.parent.bubble.apply(this.parent, arguments);
  },

  /**
   */

  _onParent: function (parent) {

    if (this._parentListeners) {
      this._parentListeners.dispose();
    } else {
      this._parentListeners  = janitor();
      this._disposeLater     = _.bind(this._disposeLater, this);
      this._updateVisibility = _.bind(this._updateVisibility, this);
    }

    this.inherit("application");

    if (!parent) return;

    if (this.name) {
      // DEPRECATED - use children
      parent.set("sections." + this.name, this);
      parent.set("children." + this.name, this);
    }

    this._parentListeners.add(parent.bind("visible", this._updateVisibility));
    this._parentListeners.add(parent.on("dispose", this._disposeLater));
  },

  /**
   */

  _updateVisibility: function () {
    this.set("visible", !!(this._rendered && (!this.parent || this.parent.visible)));
  },

  /**
   */

  _disposeLater: function () {
    var self = this;
    if (!process.browser) return this.dispose();
    (this._cleanupJanitor || (this._cleanupJanitor = janitor())).add(runlater(function () {
      self.dispose();
    }));
  }
});

module.exports = BaseView;
