[![Alt ci](https://travis-ci.org/classdojo/flatstack.js.png)](https://travis-ci.org/classdojo/flatstack.js)



```javascript
var flatstach = require("flatstack");
var queue = flatstack();


queue.push(function() {
  setTimeout(queue.pause().resume, 0);
});

//if argument[0] is present, then it's async
queue.push(function(next) {
   setTimeout(next, 0);
});

//called immediately
queue.push(function() {
  
  //but look, you can inject functions before the next one is called!
  queue.unshift(function() {
    queue.pause.resume(); //calls async timeout
  });
});
```