var vows = require('vows'),
dolce = require('../'),
assert = require('assert'),
flatten = require('./flattenCollections');


vows.describe('Explicit Routes').addBatch({
	
	'An explicit collection of routes': {
		
		topic: function() {
			var collection = require('./test-helper').collection({
				
				'a': 1,
				'a -> b': 1,
				'b -> c': 1,
				'c -> d': 1,
				'a -> b -> c -> d -> aa': 1,
				'aa -> bb': 1,
				'aa -> bb -> cc': 1
			});

			return collection;
		},

		'a length = 1': function(topic) {
			assert.equal(flatten(topic.get('a')).length, 1); //1 
		},

		'b length = 2': function(topic) {
			assert.equal(flatten(topic.get('b')).length, 2); //3
		},

		'c length = 3': function(topic) {
			assert.equal(flatten(topic.get('c')).length, 3); //6
		},

		'd length = 4': function(topic) {
			assert.equal(flatten(topic.get('d')).length, 4); //10
		},

		'aa length = 11': function(topic) {
			assert.equal(flatten(topic.get('aa')).length, 11);
		},

		'bb length = 12': function(topic) {
			assert.equal(flatten(topic.get('bb')).length, 12);
		},

		'cc length = 24': function(topic) {
			assert.equal(flatten(topic.get('cc')).length, 24); //11 + 12 + 1
		}
	}
}).export(module);