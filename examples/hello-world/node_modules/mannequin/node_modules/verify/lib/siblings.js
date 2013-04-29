var structr = require("structr");

module.exports = structr({

	/**
	 */

	"__construct": function() {
		this._source = [];
	},

	/**
	 */

	"add": function(tester) {
		this._testers.push(tester);
	},

	/**
	 */

	"validate": function(value) {
		for(var i = this._testers.length; i--;) {
			if(!this._testers.validate(newValue)) return false;
		}
		return true;
	},

	/**
	 */

	"sanitize": function(value) {
		var newValue = value;
		for(var i = this._testers.length; i--;) {
			newValue = this._testers.sanitize(newValue);
		}
		return newValue;
	}
});