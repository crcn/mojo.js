## Features

- recursively watch files
- **watch new dirs/files that have been added to any watched directory** 
- ability to ignore files with `.ignorewatch` including list of files to ignore (similar to `.gitignore`). Use `*` to ignore all files in `.ignorewatch` directory. 
  
## Installation

	npm install watch_r
	
## Example

````javascript 
  
var watch_r = require('watch_r');

watch_r('/path/to/file', function(err, watcher) {
	 
	//add / change
	watcher.on('change', function(target) {
		
		//changed file
		console.log(target.path);
	})
	
	watcher.on('remove', function(target) {
		
		//removed file
		console.log(target.path);
	});
})

```` 

