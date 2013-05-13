[![Build Status](https://travis-ci.org/crcn/tq.js.png)](https://travis-ci.org/crcn/tq.js)

TQ is a flexible, tiny queue library for node.js

## Example

```javascript
var queue = require("tq").create().start();

```

Another variation

```javascript
var queue = require('tq').queue();


[
	function() {
		this();
	},
	function() {
		this()
	},
	function() {
		this();
	}
].forEach(queue.push);

queue.start();
```


## Api


### queue.push 
pushes a queue to the end

### queue.unshift
pushes a queue to the beginning (next up)

### queue.now(callback)

### queue.then(callback)

### callback queue.wait()

### queue.start
starts a queue

### queue.stop
stops a queue