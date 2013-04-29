var dolce = require('../');
require('colors'),
Benchmark = require('benchmark');

var suite = new Benchmark.Suite,
collection = dolce.collection();


collection.addObject({

	/**
	 */

	'thruAgain -> thru': 1,

	/**
	 */

	'thruAgain': 1,

	/**
	 */

	'hello/**': 1,

	/**
	 */
	
	'hello/:world/**': 1,

	/**
	 */

	'thru -> hello/:world/test': 1,


	/**
	 */


	'a': 1,


	/**
	 */

	'a/**': 1,

	/**
	 */

	'a -> b': 1,

	/**
	 */

	'b/**': 1,

	/**
	 */

	'b -> c': 1,

	/**
	 */

	'c/**': 1,

	/**
	 */

	'a -> b -> c -> d': 1,


	/**
	 */

	'-method=POST aa':1,

	/**
	 */

	'-method=GET aa':1,

	/**
	 */

	'-method=POST aa -> bb': 1,

	/**
	 */

	'-method=GET aa -> bb': 1,

	/**
	 */

	'-method=POST bb -> cc': 1,

	/**
	 */

	'-method=GET bb -> cc': 1
});


suite.add('thruAgain -> thru -> hello/** -> hello/:world/** -> hello/:world/test', function() {

	collection.get('hello/world/test');

}).
add('a/** -> a -> b/** -> a/** -> a -> b -> c/** -> b/** -> a/** -> a -> b -> c -> d', function() {

	collection.get('d');

}).
add('-method=POST aa -> bb -> cc', function() {
	
	collection.get('cc', { method: 'POST' });

}).
on('cycle', function(event, bench) {
	console.log(String(bench));
}).
on('complete', function() {
}).
run({'async':true});



