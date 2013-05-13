define(["require", "validator/lib/validator", "validator/lib/filter", "validator/lib/validators", "validator/lib/defaultError", "validator/lib/entities"], function(require) {

    var __dirname = "validator/lib",
    __filename    = "validator/lib/index.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports,
    global        = window;

    

    var node_validator = require("validator/lib/validator");

exports.Validator = node_validator.Validator;
exports.ValidatorError = node_validator.ValidatorError;
exports.Filter = require("validator/lib/filter").Filter;
exports.validators = require("validator/lib/validators");
exports.defaultError = require("validator/lib/defaultError");

exports.entities = require("validator/lib/entities");

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