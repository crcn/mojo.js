var vows = require('vows'),
dolce = require('../'),
assert = require('assert'),
flatten = require('./flattenCollections');

vows.describe('removing routes').addBatch({
	
	'a collection of routes to remove': {
		
		topic: function() {
			var collection = require('./test-helper').collection({
				
				'a': 1,
				'-a a': 1,
				'-a -b a': 1,

				'b': 1,
				'-b b': 1,
				'-a -b b': 1
			});

			return collection;
		},

		'removee items - a.length = 2': function(topic) {
			topic.remove('a', {tags:{a:1}})
			assert.equal(flatten(topic.get('a')).length, 1); //1 
		},

		'remove a/b tags - b.length = 2': function(topic) {
			topic.remove('b', {tags:{a:1,b:1}})
			assert.equal(flatten(topic.get('b')).length, 2); //1 
		}
	}
}).export(module);