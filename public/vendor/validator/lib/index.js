define(["require", "/vendor/validator/lib/validator.js", "/vendor/validator/lib/filter.js", "/vendor/validator/lib/validators.js", "/vendor/validator/lib/defaultError.js", "/vendor/validator/lib/entities.js"], function(require) {

    var __dirname = "/vendor/validator/lib",
    __filename    = "/vendor/validator/lib/index.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports;

    

    var node_validator = require("/vendor/validator/lib/validator.js");

exports.Validator = node_validator.Validator;
exports.ValidatorError = node_validator.ValidatorError;
exports.Filter = require("/vendor/validator/lib/filter.js").Filter;
exports.validators = require("/vendor/validator/lib/validators.js");
exports.defaultError = require("/vendor/validator/lib/defaultError.js");

exports.entities = require("/vendor/validator/lib/entities.js");

//Quick access methods
exports.sanitize = exports.convert = function(str) {
    var filter = new exports.Filter();
    return filter.sanitize(str);
}

exports.check = exports.validate = exports.assert = function(str, fail_msg) {
    var validator = new exports.Validator();
    return validator.check(str, fail_msg);
}


    return module.exports;
});