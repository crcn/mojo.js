MojoJS is a fast, customizable JavaScript MVC framework that runs on NodeJS, and Web. 

This library comes pre-bundled with: 
[mojo-models](/mojo-js/mojo-models), [views](/mojo-js/mojo-views), [mojo-paperclip](/mojo-js/paperclip.js),
[mojo-router](/mojo-js/mojo-router.js), [mojo-bootstrap](/mojo-js/mojo-bootstrap), [zepto](http://zeptojs.com/), and [inject.js](http://www.injectjs.com/).

### See also

- [starter kit](https://github.com/mojo-js/mojo-starter) - seed application. Helps you get started with Mojo and browserify (commonjs).

### Projects using Mojo

- [TodoMVC](https://github.com/mojo-js/mojo-todomvc-example) - todomvc example
- [Reader](https://github.com/mojo-js/mojo-reader-example/tree/workflow) - reddit reader example
- [ClassDojo](https://www.classdojo.com/) - server-side & client-side both run Mojo.


### Build Commands

```
make browser # builds the app for the browser
make browser min # builds the app for the browser, and minifies
```


### Basic Example

Below is a basic example of how you can use Mojo in the browser. Note that it's highly recommended that you
use **commonjs** (browserify, NodeJS), or **amd** (requirejs, injectjs) when organizing your application. 

```html
<html>
  <head>
    <script type="text/javascript" src="mojo.js"></script>
  </head>
  <body>

    <script type="text/x-paperclip" id="hello-template">
      Hello! What's your name?

      <input type="text" data-bind="{{ model: <~>name }}"></input>

      {{#if:name}}
        <h1>Hello {{name}}!</h1>
      {{/}}
    </script>


    <script type="text/javascript">
      var view = new mojo.views.Base({
        paper: $("#hello-template").text()
      });

      document.body.appendChild(view.render());
    </script>
  </body>
</html>
```
