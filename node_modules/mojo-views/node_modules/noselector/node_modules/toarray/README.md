I find myself writing `item = item instanceof Array ? item : [item]` a lot, so I decided to make a simple library to does
it for me. A few examples:

```javascript
toArray = require("toarray");

console.log(toArray("hello-world!")); //["hello-world!"]
console.log(toArray(["hello-world!"])); //["hello-world!"]
console.log(toArray(undefined)); //[]
```
