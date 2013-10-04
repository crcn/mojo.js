# Mojo.js

Mojo.js is a JavaScript framework for building Single Page Applications, or static websites in [Node.js](http://nodejs.org/). It's inspired by [Angular.js](http://angularjs.org/), [Derby.js](http://derbyjs.com/), [Knockout.js](http://knockoutjs.com/), [Meteor.js](http://www.meteor.com/), [Ember.js](http://emberjs.com/), [jQuery](http://jquery.com/), and [Backbone.js](http://backbonejs.org/). 

Mojo.js was built to solve a problem - we needed a JavaScript framework that played nicely with Backbone.js, and didn't require a full rewrite of our codebase. Mojo.js allowed us to build newer code on top of old code. 


### Features

- Supported in all major browsers: `IE 8+`, `Firefox`, `Chrome`, `Safari`, and `Opera`.
- Supported in node.js.
- Flexible data-binding API. 
- Plays nicely with other frameworks such as Backbone.js, and Spine.js. Easily build new application code on top of old code.
- No magic. No assumptions. Mojo.js was built around explicity.
- 100% javascript - [paperclip.js](https://github.com/classdojo/paperclip.js) templates are also translated to javascript.

### Core Libraries

- [bindable.js](https://github.com/classdojo/bindable.js) - The data-binding layer - this is the core of everything.
- [paperclip.js](https://github.com/classdojo/paperclip.js) - template engine.


### Examples:

- [Hello World](http://jsfiddle.net/BZA8K/5/)
- [Hello Input](http://jsfiddle.net/BZA8K/1/)
- [Todo List](http://jsfiddle.net/BZA8K/2/)

# API

### mojo.View

Mojo view class

`index.html`:

```html
<html>
  <head>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript" src="https://rawgithub.com/classdojo/mojo.js/master/build/mojo2.js"></script>
    <script type="text/javascript" src="https://rawgithub.com/classdojo/paperclip.js/master/build/paperclip-compiler2.js"></script>
    <script type="text/javascript" src="./app.js"></script>

    <script type="text/x-paperclip">
      hello {{message}}
    </script>
  </head>
  <body>
    <div id="application"></div>
  </body>
</html>
```

`app.js`:

```javascript
var view = new mojo.View();
view.message = "world!";
view.paper   = paperclip.script("hello-world");
view.attach($("#application"));
```

The output should be [something like this](http://jsfiddle.net/BZA8K/5/).


### class mojo.View.extend(prototype)

Creates a new mojo view class. 

```javascript
var HelloWorldView = mojo.View.extend({
  message: "world!",
  paper: paperclip.script("hello-world")
});

var view = new HelloWorldView();
view.attach($("#application"));
```

[Here's what you get](http://jsfiddle.net/BZA8K/6/).


### view.render(callback)

renders the view

```javascript
helloWorldView.render(function() {
  console.log(helloWorldView.section.toString()); //hello world!
});
```


