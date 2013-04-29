var vows = require('vows'),
assert = require('assert'),
flatten = require('./flattenCollections'),
crema = require('crema')


vows.describe('Extends Routes').addBatch({
	
	'An explicit collection of routes': {
		
		topic: function() {

			var collection = require('./test-helper').collection({
				'-m=a a':1,
				'-m=bbbb a':1
			});

			collection.add(crema('-m=a a/*').pop(), 1);
			collection.add(crema('a/*').pop(), 1);
			collection.add(crema('-m=a a/*').pop(), 1);
			collection.add(crema('-m=a a/*').pop(), 1);
			collection.add(crema('-m=bbbb a/*').pop(), 1);

			return collection;
		},

		'a length': function(topic) {
			assert.equal(flatten(topic.get('a')).length, 8); 
		},

		'a filtered': function(topic) {
			assert.equal(flatten(topic.get('a', {tags: {m:'a'} })).length, 5); 
		},
	}

}).export(module);