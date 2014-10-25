## Frills [![Build Status](https://travis-ci.org/classdojo/frills.js.svg)](https://travis-ci.org/classdojo/frills.js)


```javascript
var fills = require("frills")();

fills.
priority("init", 0).
priority("load", 1).
priority("render", 2).
priority("display", 3);


frills.use({
  priority: "load"
});

```
