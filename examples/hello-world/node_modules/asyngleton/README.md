[![build status](https://secure.travis-ci.org/crcn/asyngleton.js.png)](http://travis-ci.org/crcn/asyngleton.js)
### Example

```javascript

var asyngleton = require('../'),
fs = require('fs');

//called ONCE
var readDir = asyngleton(function(callback) {
	fs.readdir(__dirname, callback);
})

//initializes the singleton method above
readDir(function(err, files) {
	//do stuff
})

//called after there's a result
readDir(function(err, files) {
	//do stuff
});

```


### API

#### asyngleton(factory)

Creates a new asyngleton function.

- `factory` - the factory method for creating the singleton. This is called ONCE.

#### .reset()

Resets the target asyngleton so the factory can be called again.

```javascript

var fs     = require('fs'),
asyngleton = require('asyngleton');

var readDir = asyngleton(function(callback) {
	fs.readdir(__dirname, callback);
});

readDir(function(err, files) {
	
	//make the readDir factory callable again
	readDir.reset();

	//do stuff...
});

```

#### .dictionary()

creates a dictionary of singletons

```javascript

var dict = require('asyngleton').dictionary(),
fs = require('fs');

var readThisDir = dict.get("readThisDir", function(onSingleton) {
	fs.read(__dirname, onSingleton);
});

var readLibDir = dict.get("readLibDir", function(onSingleton) {
	fs.read(__dirname + "/lib", onSingleton);
})

readThisDir(function(err, files) {
	//do stuff
});

readLibDir(function(err, files) {
	//do stuff
});
```

#### dictionary.get(name, factory)

- `name` - the name of the singleton in the dictionary
- `factory` - the factory method incase the singleton doesn't exist


### [Structr](/crcn/structr.js) Integration


```javascript

var structr = require("structr");
structr.mixin(require("asyngleton"));


var TestClass = structr({
		
	/**
	 */

	"singleton load": function(onLoad) {
		fs.readFile(__dirname + "/config.json", onLoad);
	}
});

var test = new TestClass();

test.load(function(config) {
	
});

//fs.readFile is NOT called again at this point
test.load(function(config) {
	
});
```