var protoclass     = require("protoclass"),
loaf               = require("loaf"),
SubindableObject   = require("subindable").Object,
janitor            = require("janitorjs"),
runlater           = require("runlater")(1, 100),
_                  = require("underscore"),
decor              = require("../../plugins/decor"),
generateId         = require("../../utils/idGenerator");

/**
 * @module mojo
 * @submodule mojo-views
 */

/**

## Usage

<p>Views are simply models with a few special properties: `render`, and `remove`, and `decorators`. Decorators are essentially plugins
that allow you to customize view's behavior to fit your needs. This means you can do something like add your own template engine.

Mojo was design this way to allow better compatibility between different web frameworks. </p>

At the core, this is what a mojo view is:

```javascript
var SubView = mojo.View.extend();
var view = new SubView({ name: "craig" }, new mojo.Application());
console.log(view.get("name")); //craig
console.log(view.render().toString()); // blank string, no template engine specified
```

Mojo does however come with some built-in decorators. However, you can use whatever you need.

## Paperclip Decorator

The paperclip decorator allows you to use [paperclip](https://github.com/classdojo/paperclip.js) templates with mojo.

Note that the following example assumes that you're running in either `node.js`, or have `browserified` your paperclip template:

<br />

hello.js:

```javascript
var HelloView = mojo.View.extend({
  paper: require("./hello.pc")
});

new HelloView({ name: "Mojo" }, new mojo.Application()).attach($("#application"));
```

hello.pc:

```mustache
hello  \{{name}}!
```

Here's what you get: http://jsfiddle.net/BZA8K/59



## Sections Decorator

The sections decorator allows you to easily define sub-views to your view. Here's a basic example:

```javascript

var ContentView = mojo.View.extend({
    paper: paperclip.compile("content")
});

var MainView = mojo.View.extend({
    paper: paperclip.compile("main"),
    sections: {
        content: ContentView
    }
});

```

http://jsfiddle.net/BZA8K/60 <br />

Note that you can also use registered components for each section, like so:

```javascript


//setup model data for the contacts view
var contacts = new bindable.Collection([
  new bindable.Object({ name: "John" }),
  new bindable.Object({ name: "Jane" }),
  new bindable.Object({ name: "Jeff" })
]);


// an individual contact
var ContactVew = mojo.View.extend({
  paper: require("./contact.pc")
});

// creates a contact view for each contact model
var ContactsView = mojo.View.extend({
  paper: require("./contacts.pc"),
  sections: {
    contacts: {

      // reference ListView, and pass the following properties to it
      type           : "list",
      source         : contacts,
      modelViewClass : ContactView
    }
  }
});

```

The above example creates a list of contacts. Here's what you get: http://jsfiddle.net/BZA8K/61 <br />


<p>You'll notice that the properties of each section are passed directly to the component you want to use. By default, Mojo comes with a `states`, and `list` component. See
`ListView`, and `StatesView` for further documentation.</p>

If you want to use your own custom component, you can do so by registering it to the application. For example:

```javascript

var HelloView = mojo.View.extend({
  paper: require("./hello.pc")
});


var MainView = mojo.View.extend({
  paper: require("./main.pc"),
  sections: {
    hello: {
      type: "hello",
      name: "John"
    }
  }
});

var app = new mojo.Application();
app.viewClasses.add("hello", HelloView);
app.viewClasses.add("main", MainView);

app.viewClasses.create("main").attach($("#application"));
```

Here's what you get: http://jsfiddle.net/BZA8K/62 <br />

## Bindings Decorator

The bindings decorator provides a convenient way of data-binding properties together. This is also how you create **computed properties**
a view controller. Here's an example:

```javascript
var MainView = mojo.View.extend({
  paper: paperclip.compile("main"),
  bindings: {

    // easily compute two properties together
    "firstName, lastName": {
      "fullName": {
        "map": function (firstName, lastName) {
          return firstName + " " + lastName;
        }
      }
    },

    // bind "fullName" to "fullName2" on the view controller. This
    // is especially useful when accessing properties from the application model locator
    "fullName":"fullName2",

    // bind a property to a function
    "fullName2": function (fullName) {
        console.log("fullName: ", fullName);
    }
  }
})


new MainView({ firstName: "Jon", lastName: "Anderson" });
```

Here's what you get: http://jsfiddle.net/BZA8K/67/

## Property Scope

By default, sections inherit properties from their parent. Here's a basic example:

```javascript
var HelloView = mojo.View.extend({
  paper: paperclip.compile("hello")
});


var MainView = mojo.View.extend({
  paper: paperclip.compile("main"),
  name: "jeff",
  sections: {
      hello: HelloView
  }
});
```
Result: http://jsfiddle.net/BZA8K/63 <br /> <br />


Note that since `name` is not defined in `HelloView`, it's being inherited from `MainView`. You can easily break inheritance by defining `name` in `HelloView`, like so:

```javascript
var HelloView = mojo.View.extend({
  paper: paperclip.compile("hello"),
  define: ["name"]
});


var MainView = mojo.View.extend({
  paper: paperclip.compile("main"),
  name: "jeff",
  sections: {
      hello: HelloView
  }
});
```

Here's what you get: http://jsfiddle.net/BZA8K/64



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

  SubindableObject.call(this, this);

  this._onParent     = _.bind(this._onParent, this);

  /**
   * The main application that instantiated this view
   * @property application
   * @type {Application}
   */

  // note that if application is not defined, this.application will
  // default to the default, global application.
  this.application = application;

  // ref back to this context for templates
  this["this"]     = this;

  this.initialize(data);
}

protoclass(SubindableObject, BaseView, {

  /**
   */

  _rendered: false,

  /**
   */

  __isView: true,

  /**
   */

  define: ["sections", "states"],

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
   * Called when the view is instantiated
   * @method initialize
   * @param {Object} options options passed when creating the view
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
      // throw new Error("application must be defined for view ", this.constructor.name);
      this.application = BaseView.defaultApplication;
    }

    this._decorated = true;

    if (!this.section) {

      /**
       * The section that manages the `document fragment` owned by this view controller.
       * @property section
       * @type {Section}
       */

      this.section = loaf(this.application.nodeFactory);
      this.models  = this.application.models;
    }

    this.application.decorators.decorate(this, this.constructor.prototype);
  },

  /**
   * Returns the path to the view
   * @method path
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
   * Renders the view
   * @method render
   * @return {Object} document fragment
   */

  render: function () {

    if (this._rendered) return this.section.render();
    this._rendered = true;

    if (this._cleanupJanitor) {
      this._cleanupJanitor.dispose();
      this._cleanupJanitor = undefined;
    }

    if (!this._decorated) {
      this._initDecor();
    }

    this.willRender();

    this.emit("render");

    var fragment = this.section.render();

    this.didRender();

    return fragment;
  },

  /**
   */

  willRender: function () {
    // TODO - deprecated
    this._render(this.section.show());
  },

  /**
   */

  didRender: function () {
    //OVERRIDE ME
  },

  /**
   * called in `render()`, before emitting `render` event
   * @method _render
   * @protected
   */

  _render: function (section) {
    // OVERRIDE ME
  },

  /**
   * Removes the view from the parent, or DOM
   * @method remove
   */

  remove: function () {

    if (this.section && (!this.parent || this.parent._rendered)) {
      if (this._rendered) {
        this.willRemove();
        this.emit("remove");
      }
      this.section.remove();
      this.didRemove();
    }

    this._rendered = false;
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
    if (!this.section) return $();

    var el = $(this.section.getChildNodes());

    if (arguments.length) {
      return el.find(search).andSelf().filter(search);
    }

    return el;
  },

  /**
   */

  setChild: function (name, child) {
    child.set("parent", this);
    this.set("sections." + name, child)
  },

  /**
   * Sort of a mix-in for the view. This is how `sections`, and `events` are added.
   * @method decorate
   * @param options
   * @returns {Object} this
   */

  decorate: function (options) {
    this.application.decorators.decorate(this, options);
    return this;
  },

  /*
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

    if (this._parentRemoveListener) this._parentRemoveListener.dispose();
    if (this._parentDisposeListener) this._parentDisposeListener.dispose();

    if (!this._initParent) {
      this._initParent   = true;
      this._removeLater  = _.bind(this._removeLater, this);
      this._disposeLater = _.bind(this._disposeLater, this);
    }

    this.inherit("application");

    if (!parent) return;

    this._parentRemoveListener  = parent.on("remove", this._removeLater);
    this._parentDisposeListener = parent.on("dispose", this._disposeLater);
  },

  /**
   */

  _removeLater: function () {
    var self = this;
    if (!process.browser) return this.remove();
    this.__cleanupJanitor().add(runlater(function () {
      self.remove();
    }));
  },
  /**
   */

  _disposeLater: function () {
    var self = this;
    if (!process.browser) return this.dispose();
    this.__cleanupJanitor().add(runlater(function () {
      self.dispose();
    }));
  },

  /**
   */

  __cleanupJanitor: function () {
    return this._cleanupJanitor || (this._cleanupJanitor = janitor())
  }
});

module.exports = BaseView;
