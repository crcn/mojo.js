define(["require", "/vendor/util/index.js", "/vendor/validator/lib/validators.js", "/vendor/validator/lib/defaultError.js"], function(require) {

    var __dirname = "/vendor/validator/lib",
    __filename    = "/vendor/validator/lib/validator.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports;

    

    var util = require("/vendor/util/index.js");
var validators = require("/vendor/validator/lib/validators.js");
exports.defaultError = require("/vendor/validator/lib/defaultError.js");

var ValidatorError = exports.ValidatorError = function(msg) {
    Error.captureStackTrace(this, this);
    this.name = 'ValidatorError';
    this.message = msg;
};
util.inherits(ValidatorError, Error);

var Validator = exports.Validator = function() {}

Validator.prototype.error = function (msg) {
    throw new ValidatorError(msg);
};

Validator.prototype.check = function(str, fail_msg) {
    this.str = (str == null || (isNaN(str) && str.length == undefined)) ? '' : str;
    if (typeof this.str == 'number') {
        this.str += '';
    }
    this.msg = fail_msg;
    this._errors = this._errors || [];
    return this;
}

for (var key in validators) {
    if (validators.hasOwnProperty(key)) {
        (function (key) {
            Validator.prototype[key] = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this.str);
                if(!validators[key].apply(this, args)) {
                    var msg = this.msg || exports.defaultError[key];
                    if (typeof msg === 'string') {
                        args.forEach(function(arg, i) { msg = msg.replace('%'+i, arg); });
                    }
                    return this.error(msg);
                }
                return this;
            };
        })(key);
    }
}

//Create some aliases - may help code readability
Validator.prototype.validate = Validator.prototype.check;
Validator.prototype.assert = Validator.prototype.check;
Validator.prototype.isFloat = Validator.prototype.isDecimal;
Validator.prototype.is = Validator.prototype.regex;
Validator.prototype.not = Validator.prototype.notRegex;


    return module.exports;
});