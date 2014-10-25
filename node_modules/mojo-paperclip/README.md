mojo-paperclip enables the [paperclip](https://github.com/mojo-js/paperclip.js) template engine to be used for [mojo-views](https://github.com/mojo-js/mojo-views).

### Installation

```
npm install mojo-paperclip
```


## View Example

```javascript

var views = require("mojo-views");

application.use(views);
application.use(require("mojo-paperclip"));

var SomeView = views.Base.extend({  
  paper: "<h1>Hello {{name}}</h1>"
});

var v = new SomeView({ name: "Craig" });
document.body.appendChild(v.render()); // Hello Craig
```


