runlater.js runs code asynchronously at a later time. This library is used specifically for cleanup in mojo.js. [![Build Status](https://travis-ci.org/classdojo/runlater.js.png)](https://travis-ci.org/classdojo/runlater.js)

```javascript
var runLater = require("runlater")(20);

// called after 1 ms in batches of 20 synchronous methods. 
// I.E: below runs in 2 batches of 20 (40).
for(var i = 40; i--;)
  runLater(function () {
    
  });
```
