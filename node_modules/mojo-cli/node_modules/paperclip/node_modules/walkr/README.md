## Recursive file walking / copying for node.js with middleware

## Motivation

- Ability to filter files & directories.
- Inspired by [dryice](/mozilla/dryice), [findit](/substack/node-findit).


Copyr Example:

```javascript
var walkFiles = require('walkr'),
fs            = require('fs'),
mu            = require('mu'),
tplData       = {};

walkFiles(source, destination).
filter(/^\./). //no hidden files AND dirs
filterDir(/node_modules/). //no node_modules dir
filterFile(function(options, next) {
	

	//template file? parse it, and copy it.
	if(options.source.match(/.tpl.html/)) {
		
		//after write file, call next. SINCE parameters are given, walkr assumes files were written, so it does
		//not continue.
		var tpl = mu.to_html(fs.readFileSync(options.source, "utf8"), tplData);
		return fs.writeFile(options.destination, tpl, next);

	}

	//call next without parameters 
	return next();
}).
filter(walkFiles.copy).
start(function(err) {
	
	//done
});
```


Walkr Example:

```javascript
var walkFiles = require('walkr');

walkFiles(source).
on('directory', function(ops) {
	console.log(ops.source);
}).
on('file', function(ops) {
	console.log(ops.source);
}).
start(function(err) {
	
});
```

