used to compute properties for bindable objects. Primarily used in [mojo.js](/classdojo/mojo.js)


### Installation

```coffeescript
decor = require("bindable-decor")()

//register the decorator, along with the event to listen to when applying the bindings
decor.use(require("bindable-decor-bindings")("render"))
```
