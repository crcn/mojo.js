# Mojo.js

Mojo.js is a JavaScript framework for building Single Page Applications, or static websites in [Node.js](http://nodejs.org/). It's inspired by [Angular.js](http://angularjs.org/), [Derby.js](http://derbyjs.com/), [Knockout.js](http://knockoutjs.com/), [Meteor.js](http://www.meteor.com/), [Ember.js](http://emberjs.com/), [jQuery](http://jquery.com/), and [Backbone.js](http://backbonejs.org/). 

Mojo.js was built to solve a problem - we needed a JavaScript framework that played nicely with Backbone.js, and didn't require a full rewrite of our codebase. Mojo.js allowed us to build newer code on top of old code. 


### Features

- Supported in all major browsers: `IE 8+`, `Firefox`, `Chrome`, `Safari`, and `Opera`.
- Supported in node.js.
- Flexible data-binding API. 
- Plays nicely with other frameworks such as Backbone.js, and Spine.js. Easily build new application code on top of old code.
- No magic. No assumptions. Mojo.js was built around explicity.
- 100% javascript - this also means [paperclip.js](https://github.com/classdojo/paperclip.js) templates.

### Core Libraries

- [paperclip.js](https://github.com/classdojo/paperclip.js) - template engine.
- [bindable.js](https://github.com/classdojo/bindable.js) - data-binding framework.

### Basic Examples:

- [Hello World](http://jsfiddle.net/BZA8K/1/)
- [Todo List](http://jsfiddle.net/BZA8K/2/)

### Framework Similarities

Mojo.js uses a number of libraries inspired by other frameworks. 

#### [Bindable.js](https://github.com/classdojo/bindable.js)

The data-binding layer, [bindable.js](https://github.com/classdojo/bindable.js), was inspired by [Ember](http://emberjs.com/). Here's an example:

```javascript

//takes first & last name and computes the full name
var bindable = require("bindable");
var person   = new bindable.Object();

//bind the first / last name in full name
person.bind("firstName, lastName").map(function (firstName, lastName) {
  [firstName, lastName].join(" ");
}).to("fullName").now();

person.set("firstName", "Abe");
person.set("lastName", "Anderson");
console.log(person.get("fullName")); // Abe Anderson
```


#### [Paperclip.js](https://github.com/classdojo/paperclip.js)


# API
