var structr = require("structr"),
comerr = require("comerr");

module.exports = structr({

	/**
	 */

	"__construct": function(options) {
		this._target  = options.target;
		this._testers = options.testers;
		// this._error = function(){};
		this.errors = [];
		this.success = true;
	},

	/**
	 */

	"onError": function(fn) {
		this._onError = fn;
		return this;
	},

	/**
	 */

	"onSuccess": function(fn) {
		this._onSuccess = fn;
		return this;
	},

	/**
	 */

	"has": function() {

		if(!this.success) return this;
		var keys = Array.prototype.slice.call(arguments, 0),
		testers = this._testers2 = this._getTesters(keys),
		errors = this.errors = [];

		for(var i = testers.length; i--;) {
			var t = testers[i];
			if(!t.tester.test(this._target[t.key])) {
				errors.push(new comerr.Invalid(t.tester.message() || ("\"" + t.key + "\" is invalid"), { field: t.key }));
			}
		}

		if(errors.length) {
			this.success = false;
			if(this._onError) {
				var err = new comerr.Invalid(this._getErrorMessage(errors), { all: errors });
				this._onError(err);
			}
		} else {
			if(this._onSuccess) this._onSuccess(null, true);
		}

		return this;
	},


	/**
	 */

	"sanitize": function() {
		if(!this.success) return this;
		var testers = this._testers2;
		for(var i = testers.length; i--;) {
			var t = testers[i];
			t.tester.sanitize(this._target[t.key])
		}
		return this;
	},

	/**
	 */

	"_getTesters": function(keys) {
		var testers = [];
		for(var i = keys.length; i--;) {
			var keyParts = keys[i].split(":"),
			key = keyParts[0],
			type = keyParts[1] || key;

			testers.push({
				tester: this._testers.get(type),
				key: key
			});
		}
		return testers;
	},

	/**
	 */

	"_getErrorMessage": function(errors) {
		return errors.map(function(error) {
			return error.message;
		}).join("\n");
	}

});