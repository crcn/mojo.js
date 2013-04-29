var vows = require('vows'),
assert = require('assert'),
flatten = require('./flattenCollections');


vows.describe('Regexp Routes').addBatch({
	
	'A set of greedy routes': {
		
		topic: function() {
			var collection = require('./test-helper').collection({
				':file': 1,
				':file(\\w+.js)':1,
				':file(\\w+.css)': 1,
				'-a :file(\\w+.html)': 3,
				':file(\\w+.html)': 1,
				'b.html': 1,
				'a/:pluck(\\w+\.(css|js))/hello': 1,
			});

			return collection;
		},

		'a.js length = 1': function(topic) {
			assert.equal(flatten(topic.get('a.js')).length, 1); 
		},

		'a.css length = 1': function(topic) {
			assert.equal(flatten(topic.get('a.css')).length, 1); 
		},

		'a.html length = 2': function(topic) {
			assert.equal(flatten(topic.get('a.html')).length, 2); 
		},

		'b.html length = 1': function(topic) {
			assert.equal(flatten(topic.get('b.html')).length, 1); 
		},

		'a/b/hello length = 0': function(topic) {
			assert.equal(flatten(topic.get('a/b/hello')).length, 0); 
		},

		'a/b.js/hello length = 1': function(topic) {
			assert.equal(flatten(topic.get('a/b.js/hello')).length, 1); 
		}
	}

}).export(module);