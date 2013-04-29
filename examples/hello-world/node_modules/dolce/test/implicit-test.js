var vows = require('vows'),
assert = require('assert'),
flatten = require('./flattenCollections');


vows.describe('Implicit Routes').addBatch({
	
	'An explicit collection of routes': {
		
		topic: function() {
			var collection = require('./test-helper').collection({
				'a': 1,
				'b': 1,
				'c': 1,
				'd': 1,
				'a/+': 1,
				'a -> b/+': 1,
				'b -> c/+': 1,
				'c -> d/+': 1,
				'a -> aa': 1,
				'a -> b -> bb': 1,
				'a -> b -> c -> cc': 1,
				'a -> b -> c -> d -> dd': 1,
				'aa/*': 1,
				'aa -> bb/*': 1,
				'aa -> bb -> cc/+': 1,
				'aa -> bb -> cc -> dd/+':1
			});


			return collection;
		},

		'a length = 2': function(topic) {
			assert.equal(flatten(topic.get('a')).length, 2); 
		},

		'b length = 4': function(topic) {
			assert.equal(flatten(topic.get('b')).length, 4); 
		},

		'c length = 6': function(topic) {
			assert.equal(flatten(topic.get('c')).length, 6); 
		},

		'd length = 8': function(topic) {
			assert.equal(flatten(topic.get('d')).length, 8); 
		},

		'aa length = 4': function(topic) {
			assert.equal(flatten(topic.get('aa')).length, 4); 
		},

		'bb length = 12': function(topic) {
			assert.equal(flatten(topic.get('bb')).length, 12); 
		},

		'cc length = 30': function(topic) {
			assert.equal(flatten(topic.get('cc')).length, 30); 
		},

		'dd length = 68': function(topic) {
			assert.equal(flatten(topic.get('dd')).length, 68); 
		}
	}
}).export(module);