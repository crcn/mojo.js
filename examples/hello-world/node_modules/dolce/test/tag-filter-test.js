var vows = require('vows'),
assert = require('assert'),
flatten = require('./flattenCollections');


vows.describe('Tagged routes').addBatch({
	
	'An collection of mixed tags routes': {
		
		topic: function() {
			var collection = require('./test-helper').collection({
				
				'-method=GET a':1,
				'-method=POST a': 1,
				'-method=DELETE a': 1,
				'-method=PUT a': 1,
				'-unfilterable a': 1
			});


			return collection;
		},

		'has a GET a length of 2': function(topic) {

			assert.equal(flatten(topic.get('a', { siftTags: {
				$or:[
					{ unfilterable: true },
					{ method: 'GET' }
				]
			} })).length, 2); 
		},

		'has 5 filterable items': function(topic) {
			
			assert.equal(flatten(topic.get('a', { siftTags: {
				$or:[
					{ unfilterable: false }
				]
			} })).length, 5); 
		}
	}

}).export(module);