Subindable.js allows you to inherit properties from a parent bindable.Object. It's used in Mojo.js. [![Alt ci](https://travis-ci.org/classdojo/subindable.js.png)](https://travis-ci.org/classdojo/subindable.js)

```javascript
var subindable = require("subindable");

var p = new subindable.Object({ name: "craig" }),
c     = new subindable.Object({}, p); // second param = parent


console.log(c.get("name")); // craig
p.set("name", "jake"));
console.log(c.get("name")); // jake

```
