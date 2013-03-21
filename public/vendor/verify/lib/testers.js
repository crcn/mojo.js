define(["require", "/vendor/structr/lib/index.js", "/vendor/verify/lib/tester.js"], function(require) {

    var __dirname = "/vendor/verify/lib",
    __filename    = "/vendor/verify/lib/testers.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports;

    

    var structr = require("/vendor/structr/lib/index.js"),
Tester      = require("/vendor/verify/lib/tester.js");

module.exports = structr({

	/**
	 */

	"__construct": function() {
		this._source = {};
		this.register()
	},

	/**
	 */

	"register": function(name, message) {
		return this._source[name] = this.create(name, message);
	},


	/**
	 */

	"create": function(name, message) {
		return new Tester({
			testers: this,
			name: name,
			message: message
		});
	},

	/**
	 */

	"get": function(key) {
		return this._source[key] || this.register(key);
	}
});

    return module.exports;
});