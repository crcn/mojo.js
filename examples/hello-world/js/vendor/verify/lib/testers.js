define(["require", "structr", "verify/lib/tester"], function(require) {

    var __dirname = "verify/lib",
    __filename    = "verify/lib/testers.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports,
    global        = window;

    

    var structr = require("structr"),
Tester      = require("verify/lib/tester");

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