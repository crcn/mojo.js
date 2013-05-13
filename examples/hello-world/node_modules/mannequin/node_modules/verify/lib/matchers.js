var structr = require("structr");

module.exports = structr({

	/**
	 */

	"__construct": function(testers, pos) {
		this._testers = testers;
		this._source = [];
		this._pos = pos !== undefined;
	},

	/**
	 */

	"add": function(value) {

		var match;

		if(value.test) {
			match = value;
		} else
		if(typeof value == "string") {
			match = this._testers.get(value)
		} else
		if(typeof value == "function") {
			match = {
				test: value
			};
		}

		this._source.push(match);
	},

	/**
	 */

	"test": function(value) {
		
		for(var i = 0, n = this._source.length; i < n; i++) {
			var match = this._source[i];
			if(!match.test(value)) return !this._pos;
		}
		return this._pos;
	},

	/**
	 */

	"sanitize": function(value) {
		var newValue = value;
		for(var i = 0, n = this._source.length; i < n; i++) {
			var match = this._source[i];
			if(match.sanitize) match.sanitize(newValue);
		}
		return newValue;
	}
});