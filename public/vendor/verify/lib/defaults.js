define(["require", "/vendor/validator/lib/index.js"], function(require) {

    var __dirname = "/vendor/verify/lib",
    __filename    = "/vendor/verify/lib/defaults.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports;

    

    var validator = require("/vendor/validator/lib/index.js"),
check = validator.check;

exports.plugin = function(verify) {


	var reg = {
		"email": "isEmail",
		"url": "isUrl",
		"ip": "isIP",
		"alpha": "isAlpha",
		"numeric": "isNumeric",
		"int": "isInt",
		"lowercase": "isLowercase",
		"uppercase": "isUppercase",
		"decimal": "isDecimal",
		"float": "isFloat",
		"null": "null",
		"notNull": "notNull",
		"notEmpter": "notEmpty",
		"array": "isArray",
		"creditCard": "isCreditCard"
	};


	Object.keys(reg).forEach(function(key) {
		var fn = reg[key];
		verify.register(key).is(function(value) {
			try {
				var chain = check(value);
				chain[fn].call(chain, value);
				return true;
			} catch(e) {
				return false;
			}
		})
	})
}

    return module.exports;
});