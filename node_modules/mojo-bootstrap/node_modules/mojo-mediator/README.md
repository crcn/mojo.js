Mojo-mediator is a plugin that provides a communication layer for different parts of your application. It uses [mediocre.js](https://github.com/classdojo/mediocre.js).


entry.js:

```javascript
var mojo = require("mojojs"),
app      = new mojo.Application();

app.
  use(require("mojo-mediator")).
  use(require("./commands"));

app.mediator.execute("initialize", function () {
});
```

commands/index.js

```javascript
module.exports = function (app) {
  app.mediator.on("initialize", function (message, next) {
    // do stuff
    next();
  });
}
```
