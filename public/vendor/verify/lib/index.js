define(["require", "/vendor/verify/lib/defaults.js", "/vendor/verify/lib/check.js", "/vendor/verify/lib/testers.js"], function(require) {

    var __dirname = "/vendor/verify/lib",
    __filename    = "/vendor/verify/lib/index.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports;

    

    var defaults = require("/vendor/verify/lib/defaults.js"),
Check = require("/vendor/verify/lib/check.js"),
Testers = require("/vendor/verify/lib/testers.js");


module.exports = function() {

	var testers = new Testers();

	var self = {

		/**
		 */

		register: function(name, message) {
			return testers.register(name, message);
		},

		/**
		 */

		"tester": function() {
			return testers.create();
		},

		/**
		 */

		get: function(name) {
			return testers.get(name);
		},

		/**
		 */

		check: function(target) {
			return new Check({
				testers: testers,
				target: target
			});
		},

		/**
		 */

		that: function(target) {
			return this.check(target);
		}
	};


	defaults.plugin(self);

	return self;
}

    return module.exports;
});