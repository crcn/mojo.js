var vows = require('vows'),
dolce = require('../'),
assert = require('assert'),
flatten = require('./flattenCollections');


vows.describe('Param-based routes').addBatch({
	
	'A mix of parameterized routes': {
		
		topic: function() {
			var collection = require('./test-helper').collection({
				'a/b':1,
				':a/b': 1,
				'a/:b': 1,
				':a/:b': 1,
				'a/b/c':1,
				':a/b/c':1,
				'a/:b/c':1,
				'a/b/:c':1,
				':a/:b/:c':1

			});

			return collection;
		},

		'has a/b': function(topic) {
			assert.equal(flatten(topic.get('a/b')).length, 1); //1 
		},

		'has aa/b': function(topic) {
			assert.equal(flatten(topic.get('aa/b')).length, 1); //1 
		},

		'has a/bb': function(topic) {
			assert.equal(flatten(topic.get('a/bb')).length, 1); //1 
		},

		'has aa/bb': function(topic) {
			assert.equal(flatten(topic.get('aa/bb')).length, 1); //1 
		}

	}
}).export(module);