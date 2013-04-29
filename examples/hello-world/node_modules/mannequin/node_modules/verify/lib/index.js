var defaults = require("./defaults"),
Check = require("./check"),
Testers = require("./testers");


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