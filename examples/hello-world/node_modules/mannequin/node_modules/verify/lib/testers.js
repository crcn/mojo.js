var structr = require("structr"),
Tester      = require("./tester");

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