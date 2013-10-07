# Mojo.js

Mojo.js is a JavaScript framework for building Single Page Applications, or static websites in [Node.js](http://nodejs.org/). It's inspired by [Angular.js](http://angularjs.org/), [Derby.js](http://derbyjs.com/), [Knockout.js](http://knockoutjs.com/), [Meteor.js](http://www.meteor.com/), [Ember.js](http://emberjs.com/), [jQuery](http://jquery.com/), and [Backbone.js](http://backbonejs.org/). 

Mojo.js was built to solve a problem - we needed a JavaScript framework that played nicely with Backbone.js, and didn't require a full rewrite of our codebase. Mojo.js allowed us to build newer code on top of old code. 

### Features

- Supported in all major browsers: `IE 8+`, `Firefox`, `Chrome`, `Safari`, and `Opera`.
- Supported in node.js.
- Flexible data-binding API. 
- Plays nicely with other frameworks such as Backbone.js, Spine.js, and jQuery. Easily build new application code on top of old code.
- No magic. No assumptions. Mojo.js was built around explicity.
- 100% javascript - [paperclip.js](https://github.com/classdojo/paperclip.js) templates are also translated to javascript.
- It's unopinionated
  - There's no concept of inheritance, and all functionality is shoved in `decorators`. This concept is actually derrived from jquery plugins - where plugins can be attached to DOM elements, `decorators` are similar in the sense that they attach to one abstraction higher - the view controlling the DOM element.
  - The framework itself is broken into multiple repositories - this makes it easier to encapsulate, and re-use bits of functionality. It also helps explain parts of the framework a little better.

### Core Libraries

- [bindable.js](https://github.com/classdojo/bindable.js) - data-binding layer.
- [paperclip.js](https://github.com/classdojo/paperclip.js) - template engine.
- [loaf.js](https://github.com/classdojo/loaf.js) - controls sections, or virtual document fragments.
- [flatstack](https://github.com/classdojo/flatstack.js) - queue for rendering / removing views.


### Examples:

- [Hello World](http://jsfiddle.net/BZA8K/16/)
- [Hello Input](http://jsfiddle.net/BZA8K/17/)
- [Todo List](http://jsfiddle.net/BZA8K/18/)

### Installation

You can get started with Mojo.js by installing the [starter kit](http://github.com/classdojo/mojo-boilerplate). In terminal run:

```bash
git clone git@github.com:classdojo/mojo-boilerplate.git; cd mojo-boilerplate; npm install;
```

## View Usage

Views extend [bindable](http://github.com/classdojo/bindable.js) objects. The best way to create a view is to first create a sub-class, then instantiate it. For example:

```javascript
var SubView = mojo.View.extend({
  name: "craig"
});
var view = new SubView();
console.log(view.get("name")); //craig
```

You can also do it the other way:

```javascript
var view = new mojo.View({
  name: "craig";
})

console.log(view.get("name"));
```


#### view.attach(selector)

Renders, and adds the view to the DOM. [Here's an example](http://jsfiddle.net/BZA8K/12/):

```javascript
var view = new mojo.View({
  paper: paperclip.compile("hello!")
});
view.attach($("#application"));
```

#### view.render(callback)

Renders the view. [For example](http://jsfiddle.net/BZA8K/14/):

```javascript
var view = new mojo.View({
  paper: paperclip.compile("hello!")
});
view.render(function() {
  alert(view.section.toString());
});
```

#### view.section

The [loaf section](https://github.com/classdojo/loaf.js). This is where everything is rendered to.

#### view.remove(callback)

Removes the view from the DOM.

#### view.callstack

the queue for rendering / removing views. This is particularly useful if you need to perform an action before a view is completely rendered, or removed. [Transitions](https://github.com/classdojo/mojo.js/blob/master/src/views/base/decor/transition.coffee) are a good example.

#### view.emit(event [, data...])

emits an event

### view.on(event, listener)

listener for an event. For example:

```javascript
var view = new mojo.View();
view.on("hello", function() {
  
});
view.emit("hello"); //trigger listener
```

#### view.bubble(event [, data...])

bubbles an event up to the root view.

#### view.parent

reference to the parent view

#### events

- `render` - emitted when `view.render()` is called.
- `rendered` - emitted after the view has been rendered.
- `remove` - emitted when `view.remove()` is called.
- `removed` - emitted after the view has been removed.
- `dispose` - emitted when the view is being disposed.


#### protected methods

Mojo.js has a few methods you can override if you need to something durring render / remove. 

```javascript
var view = new mojo.View({
  _onRender: function() {
    //called on render
  },
  _onRendered: function() {
    //called on rendered
  },
  _onRemove: function() {
    //called on remove
  },
  _onRemoved: function() {
    //called on removed
  }
});
```


## View Decorators

Mojo.js views are incredibly flexible. Views are decorator based, so they don't really depend on any of the following features:


### Bindings

Bindings are similar to Ember's computed properties. [For example](http://jsfiddle.net/BZA8K/5/):

```javascript
var view = new mojo.View({
  bindings:
});
```

### Templates

By default, Mojo.js uses [paperclip.js](https://github.com/classdojo/paperclip.js) for the template engine. [Here's a basic example](http://jsfiddle.net/BZA8K/5/):

```javascript
var view = new mojo.View({
  paper: paperclip.compile("hello world!")
});
view.attach($("#application"));
```

You can also dynamically change the template, Say for instance you want to change the template depending on a model type, here's what you can do:

```javascript

var templates = {
  alert   : paperclip.compile("notification-alert"),
  photo   : paperclip.compile("notification-photo")
  default : paperclip.compile("notification-default")
}


var NotificationView = mojo.View.extend({
  bindings: {
    "type":
      "paper": 
        "map": function(type) {
          return templates[type] || templates.default;
        }
  }
});

var alertView = new NotificationView({ model: new bindable.Object({ type: "alert" }) });
var photoView = new NotificationView({ model: new bindable.Object({ type: "photo" }) });
```

You can add your own template - just create a [custom decorator](#custom-decorators).


### Events

### Definitions

### Transitons

### Sections

### List Sections

### State Sections

### Custom Decorators











