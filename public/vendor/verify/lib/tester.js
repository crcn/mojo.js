define(["require", "/vendor/structr/lib/index.js", "/vendor/verify/lib/sanitizers.js", "/vendor/verify/lib/matchers.js", "/vendor/verify/lib/siblings.js", "/vendor/validator/lib/index.js", "/vendor/toarray/index.js"], function(require) {

    var __dirname = "/vendor/verify/lib",
    __filename    = "/vendor/verify/lib/tester.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports;

    

    var structr = require("/vendor/structr/lib/index.js"),
Sanitizers  = require("/vendor/verify/lib/sanitizers.js"),
Matchers    = require("/vendor/verify/lib/matchers.js"),
Siblings    = require("/vendor/verify/lib/siblings.js"),
validator = require("/vendor/validator/lib/index.js"),
check = validator.check,
toarray = require("/vendor/toarray/index.js");

module.exports = structr({

	/**
	 */

	"__construct": function(options) {

		this._testers    = options.testers;
		this.name        = options.name;
		this._message    = options.message;

		this._sanitizers = new Sanitizers();
		this._is         = new Matchers(this._testers, true);
		this._not        = new Matchers(this._testers);

		this._registerValidator("equals", "contains", "len", "isUUID", "isBefore", "isAfter", "isIn", "notIn", "max", "min");
	},

	/**
	 */

	"message": function(value) {
		if(arguments.length === 0) return this._message;
		this._message = value;
		return this;
	},

	/**
	 */

	"is": function(test) {
		this._is.add(test);
		return this;
	},

	/**
	 */

	"not": function(test) {
		this._not.add(test);
		return this;
	},

	/**
	 * DEPRECATED
	 */

	"addSanitizer": function() {
		this.sanitize.apply(this, arguments);
	},

	/**
	 */

	"sanitize": function(match, sanitizer) {
		this._sanitizers.add(match, sanitizer);
		return this;
	},

	/**
	 */

	"test": function(value) {
		return value !== undefined && this._is.test(value) && !this._not.test(value);
	},

	/**
	 */

	"match": function(options) {
		for(var key in options) {
			this[key].apply(this, toarray(options[key]));
		}
		return this;
	},

	/**
	 */

	"sanitize": function(value) {
		var newValue = this._is.sanitize(value);
		return this._sanitizers.sanitize(newValue);
	},


	/**
	 */

	"_registerValidator": function() {
		var keys = Array.prototype.slice.call(arguments, 0), 
		self = this;
		keys.forEach(function(key) {
			self[key] = function() {
				var args = arguments;
				self.is(function(value) {
					try {
						var chain = check(value);
						chain[key].apply(chain, args);
						return true;
					} catch(e) {
						return false;
					}
				});
			}
		});
	}
});

    return module.exports;
});