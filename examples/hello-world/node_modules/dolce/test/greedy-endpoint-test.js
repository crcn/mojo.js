var vows = require('vows'),
dolce = require('../'),
assert = require('assert'),
flatten = require('./flattenCollections');


vows.describe('Greedy Endpoints').addBatch({
	
	'An collection of greedy endpoints': {
		
		topic: function() {
			var collection = require('./test-helper').collection({
				'public/**' : 1
			});

			return collection;
		},

		' public/test/some/route has a length of 1': function(topic) {
			//assert.equal(flatten(topic.get('public/test/some/route')).length, 1);
		}
	}
}).export(module);