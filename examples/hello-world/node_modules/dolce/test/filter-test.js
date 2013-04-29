var vows = require('vows'),
dolce = require('../'),
assert = require('assert'),
flatten = require('./flattenCollections');


vows.describe('Finding routes').addBatch({
	
	'A mixed collection': {
		
		topic: function() {
			var collection = require('./test-helper').collection({
				'-hook test': 1,
				'-method=GET test2': 1,
				'-hook=test test3': 1,
				'-method=POST test3': 2
			});

			return collection;
		},

		'has 1 hook': function(topic) {
			assert.equal(topic.find({ tags: { hook: true }}).length, 2);
		},

		'has 3 sifted tags': function(topic) {
			assert.equal(topic.find({ siftTags: {$or: [{ method: 'GET' }, { hook: { $exists: true } }] }}).length, 3);
		}
	}
}).export(module);