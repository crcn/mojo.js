define(["require", "/vendor/structr/lib/index.js"], function(require) {

    var __dirname = "/vendor/verify/lib",
    __filename    = "/vendor/verify/lib/sanitizers.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports;

    

    var structr = require("/vendor/structr/lib/index.js");

module.exports = structr({

	/**
	 */

	"__construct": function() {
		this._source = [];
	},

	/**
	 */

	"add": function(match, sanitizer) {

		if(arguments.length === 1) {
			sanitizer = match;
			match = null;
		}

		this._source.push({
			match: match,
			sanitize: sanitizer
		});
	},

	/**
	 */

	"sanitize": function(value) {
		var newValue = value;
		for(var i = this._source.length; i--;) {
			var sanitizer = this._source[i];
			if(!sanitizer.match || sanitizer.test(String(newValue))) {
				newValue = sanitize(newValue);
			}
		}
		return newValue;
	}
});

    return module.exports;
});