define(["require", "verify/lib/defaults", "verify/lib/check", "verify/lib/testers"], function(require) {

    var __dirname = "verify/lib",
    __filename    = "verify/lib/index.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports,
    global        = window;

    

    var defaults = require("verify/lib/defaults"),
Check = require("verify/lib/check"),
Testers = require("verify/lib/testers");


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