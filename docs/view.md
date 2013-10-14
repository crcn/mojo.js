### class mojo.View(options)

- `parent`: [BindableObject](https://github.com/classdojo/bindable.js)

Mojo view class. Views are bindable object [Example](http://jsfiddle.net/BZA8K/11/):

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
var view = new mojo.View({
  message : "world!",
  paper   : paperclip.script("hello-world")
});
view.attach($("#application"));
```


### class mojo.View.extend(prototype)

Creates a new mojo view class. [Example](http://jsfiddle.net/BZA8K/6/):

```javascript
var HelloWorldView = mojo.View.extend({

  message : "world!",
  paper   : paperclip.script("hello-world"),

  _onRender   : function() {
    //called on render
  },
  _onRendered : function() {
    //called on rendered
  },
  _onRemove   : function() {
    //called on remove
  },
  _onRemoved  : function() {
    //called on removed
  } 
});

var view = new HelloWorldView();
view.attach($("#application"));
```


### view.render(callback)

renders the view. [Example](http://jsfiddle.net/BZA8K/10/):

```javascript
helloWorldView.render(function() {
  alert(helloWorldView.section.toString()); //hello world!
});
```

### view.remove(callback)
