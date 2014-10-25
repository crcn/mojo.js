## Mojo Animator [![Build Status](https://travis-ci.org/classdojo/mojo-animator.svg)](https://travis-ci.org/classdojo/mojo-animator)

Mojo animator is a plugin that leverages the browsers native `requestAnimationFrame` function to update the layout. It's used in [paperclip](github.com/classdojo/paperclip.js), and [mojo-views](https://github.com/classdojo/mojo-views).

```javascript
var Application = require("mojo-application");

var MyApplication = Application.extend({
  registerPlugins: function () {
    this.use(require("mojo-animator"));
  }
});

var app = new MojoApplication();

// calls requestAnimationFrame
app.animate({
  update: function () {
    // do something
  }
})
```
