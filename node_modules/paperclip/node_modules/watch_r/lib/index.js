var EventEmitter = require('events').EventEmitter,
fs = require('fs'),
Structr = require('structr'),
_ = require("underscore");


function eachAsync(target, callback) {
	
	var n = target.length;
	
	function next() {
		
		n--;
		callback(target[n], n);
		if(n) process.nextTick(next);
	}
	
	if(n) process.nextTick(next);
};


var Watchr = Structr({
	
	/**
	 */
	
	'__construct': function(ops) {
		
		this._em = new EventEmitter();
		
		//resolved path to given file
		this.path = ops.path;
		
		this._children = {}; 
		
		//files that are currently being watched - only *one* watcher
		this._watching = ops.watching;

		this.created = ops.created;

		this._watch    = ops.watch;
		
		this.parent(ops.parent);
		
		this.init();
		
	},
	
	/**
	 */
	
	'on': function(event, callback) {
		
		this._em.addListener(event, callback);
	},
	
	/**
	 */
	
	'parent': function(value) {
		 
		if(value) {
			this._parent = value;
		}
		
		return this._parent;
	},

	/**
	 */

	'root': function() {
		var p = this;
		while(p._parent) {
			p = p._parent;
		};
		return p;
	},
	
	/**
	 */
	
	'dispose': function() { 
		
		this.change('remove', this);
		
		delete this._watching[this.path];
		fs.unwatchFile(this.path);
		this._em = new EventEmitter();
		
		if(this.isDirectory) {
			
			for(var file in this._children) {
				
				var watcher = this._watching[this.path + '/' + file];
				
				if(watcher) watcher.dispose();
			}
		}
	},
	
	
	/**
	 */
	
	
	'init': function() {

		var path = this.path,
		self = this;
		
		try {
			var stat = fs.statSync(path);                   
		} catch(e) { 
			this.dispose();
			return;
		}

		var isDir = stat.isDirectory(),
		onFileChange;
		
		if(this.isDirectory = stat.isDirectory()) {
			onFileChange = function(cur, prev) {
				self._watchDirFiles(!!cur);
			}
			onFileChange();
		} else {

			onFileChange = function(cur, prev) {
				if(cur.nlink != 0 && cur.mtime.getTime() == prev.mtime.getTime()) return;

				if(cur.nlink == 0) 
					self.dispose();
				else
					self.change();
			};

			if(this.created) {
				this.change("new", this);
			}

			this.change('file', this);
		}

		if(this.root()._watch !== false) {
			fs.watchFile(path, { persistent: true, interval: 500 }, onFileChange);
		}
	},  
	
	/**
	 */
	
	'change': function(event, target) {
		
		if(!event) event = 'change';
		if(!target) target = this;
		
		this._em.emit(event, target);
		
		if(this.parent()) {
			
			this.parent().change(event, target);
		} else if(event == 'change') {
			
			for(var path in this._watching) {
				
				var watcher = this._watching[path];
				
				if(!watcher.isDirectory) continue;
				  
				watcher._watchDirFiles();
			}
		}
		
	},

	/**
	 */

	'_scanForNewFiles': function() {
		for(path in this._watching) {
			var watcher = this._watching[path];
			if(!watcher.isDirectory) continue;
			watcher._watchDirFiles();
		}
	},
	
	/** 
	 */
	
	'_watchDirFiles': function(triggerFromWatch) {
		
		var self = this, path = self.path;
		
		process.nextTick(function() {
			
			fs.readFile(path + '/.ignorewatch', 'utf8', function(err, content) { 
				var ignore = {};
				
				if(content != undefined) {
					
					var n = 0;
					
					content.split(/[\s\r\n\t]+/g).forEach(function(file) {
						
						if(!file.match(/\w+/g)) return;
						n++;
						
						ignore[file] = 1;
					})
					
					//nothing specified, or star
					if(!n || ignore['*']) return;	
				}
				
				fs.readdir(path, function(err, files) {

					if(err) return;

					files.forEach(function(file, i) {

						if(file.substr(0,1) == '.' || ignore[file]) return;

						var filePath = path + '/' + file;

						self._children[file] = 1;

						Watchr.watch({ path: filePath, resolved: true, parent: self, watching: self._watching, created: triggerFromWatch });
					});
				});	
			});
		});
	},
	
	/**
	 * called by user
	 */    
	
	'static watch': function(ops, callback) {
		
		if(!callback) callback = function() { };
		
		function onResolvedPath(err, resolvedPath) {
			
			var watcher = ops.watching[resolvedPath];
			                               
			if(watcher) {  
				return callback(false, watcher);
			}            
			
			callback(false, ops.watching[resolvedPath] = new Watchr(ops));
		}
			
		if(!ops.resolved) {
			
			fs.realpath(ops.path, onResolvedPath);
		} else {
			
			onResolvedPath(false, ops.path);
		}
	}
	
	
});


var watching = {};

module.exports = function(file, ops, callback) {

	if(arguments.length == 2) {
		callback = ops;
		ops = {};
	}

	if(file instanceof Array) {
		return file.forEach(function(f) {
			module.exports(f, callback);
		});
	}

	Watchr.watch(_.extend(ops, { path: file, watching: watching }), callback);
}