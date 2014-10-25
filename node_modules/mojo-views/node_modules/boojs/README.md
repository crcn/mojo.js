Boo.js is a library that runs a function when a user is inactive. It's used in Mojo.js to warm-up views asynchronously before they're used.

Example: http://jsfiddle.net/G56uE/4/

```javascript
var boo = require("boo");


// run this function every N MS
boo.interval(function () {
  
}, 100);


// run this function when a user is inactive
boo.run(function () {
  
});


// trigger wait for 1 second
boo.wait();
```
