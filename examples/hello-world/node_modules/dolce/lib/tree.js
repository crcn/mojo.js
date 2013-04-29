var crema = require('crema');

var tree = module.exports = function(ops) {

	//ops doesn't exist? it's the root
	if(!ops) ops = { name: '', 
	param: false, 
	parent: null,
	depth: 0,
	deepest: 0};

	//child trees
	var _children = {},

	_testableChildren = {},

	//THIS tree
	self = {},

	//parent tree obj
	_parent = ops.parent,

	//the root tree /
	_root   = ops.root || self,

	//collections added to this tree?
	_hasListeners = false,

	//the path value to THIS tree object
	_path   = { value: ops.name, param: ops.param },

	//used for debugging
	_pathStr = _parent ? _parent.path().value + '/' + ops.name : '/',

	//string rep of path to the tree
	_segments = _parent ? _parent.segments().concat(_path) : [_path],

	_pathStr = crema.stringifySegments(_segments);

	self.collections = {

		//chain is path/**, which means everything *after* path is handled by this route, which
		//means we need to fetch the parent chain
		greedy: [],

		greedyExtend: [],

		//handled before after
		extend: [],

		//handled last
		endpoint: []
	};



	var _addListener = self.addListener = function(type, data) {
		
		var collections = self.collections[type];
		data.path       = _pathStr;
		data.type       = type;

		if(type.indexOf('greedy') > -1) data.greedy = true;

		collections.push(data);

		_hasListeners = true;

		return {

			/**
			 * removes the data from the collection
			 */

			dispose: function() {
				
				var i = collections.indexOf(data);

				//make sure the data exists before removing it from the collection
				if(i > -1) collections.splice(i, 1);

			}
		}
	}

	var _greedyListeners = function() {

		if(!_parent) return [];
	}

	/**
	 * traverse the tree
	 */

	self.traverse = function(callback) {
		callback(this);

		for(var name in _children) {
			_children[name].traverse(callback);
		}

		for(var key in _testableChildren) {
			_testableChildren[key].traverse(callback);
		}
	}


	/**
	 * retrieves a child path
	 */

	self.child = function(path, createIfNotFound) {


		//if the path is a parameter, then the NAME is __param as well
		var name = path.param  ? '__param' : path.value;


		if(path.test) {
			if(_testableChildren[path.test.source]) {
				return _testableChildren[path.test.source];
			}	
		}
		else
		//return the child if it exists
		if(_children[name]) {
			return _children[name];
		}

		//otherwise, *create* the child 
		if(createIfNotFound) {

			var child = tree({ name: name,
				param: path.param, 
				test: path.test,
				parent: self, 
				root: _root,
				depth: ops.depth + 1, 
				deepest: 0 });

			if(path.test) {
				_testableChildren[path.test.source] = child;
			} else {
				_children[name] = child;
			}

			return child;
		}

		return null;
	}




	self._test = function(segment) {
		return ops.test.test(segment.value);
	}


	function findTestedChild(path) {

		for(var key in _testableChildren) {
			var child = _testableChildren[key];
			if(child._test(path)) return child;
		}
	}

	/**
	 * finds a child based segments given
	 */

	self.findChild = function(segments) {

		return _findChildren(self, segments, 0);
	};


	var _findChild = self._findChild = function(segments, index, weighTowardsParam) {

		var currentPath, foundChild, childTree;


		//are we at the end?
		if(segments.length - index === 0) {

			return _hasListeners ? self : null;

		}

		currentPath = segments[index];


		//if we're weighing for parameters, then a route has not been defined
		//for the given path
		if(!weighTowardsParam || !(childTree = _children.__param)) {

			childTree = _children[currentPath.value] || findTestedChild(currentPath);
		}


		return childTree ? _findChildren(childTree, segments, index + 1) : null;
	}


	var _findChildren = function(tree, segments, index) {
		
		if(!tree) return null;

		// var param = segments[index] ? segments[index].param : false, found;

		var found;

		//SUPER NOTE:
		// before we'd check if there was a parameter. IF there was then we'd skip the weight towards a non-param route.
		// This is counter-intuitive. IF i have routes:
		// make/task
		// make/web
		// make/:something
		// and I call: make/:something -> makeIt, with :something as "task", I'd expect to hit the explicit "make/task" route vs the parameter.
		//

		if(found = tree._findChild(segments, index, false)) return found;


		return  tree._findChild(segments, index, true);
	}


	/**
	 * returns the current parent
	 */

	self.parent = function() {

		return _parent;

	};

	self.path = function() {
		
		return _path;
	}

	self.pathStr = function() {
		
		return _pathStr;

	}

	self.segments = function() {

		return _segments;
		
	}



	return self;
}