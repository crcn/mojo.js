var structr = require("structr");

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