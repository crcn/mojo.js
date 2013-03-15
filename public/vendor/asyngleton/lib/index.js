define(["require", "/vendor/events/index.js"], function(require) {

    var __dirname = "/vendor/asyngleton/lib",
    __filename    = "/vendor/asyngleton/lib/index.js",
    module        = { exports: {} },
    exports       = module.exports;

    

    var EventEmitter = require("/vendor/events/index.js").EventEmitter;

/**
 */

function singleton(fn) {

	var em = new EventEmitter(), singletonArgs, loading, ret;

	var asyngleton = function() {

		var args, cb, callback = arguments[arguments.length - 1];

		if(!(typeof callback == "function")) {
			callback = function(){};
		}

		//result already set? return the value
		if(singletonArgs) {
			callback.apply(this, singletonArgs);

			//return the value if there is one
			return ret;
		}


		em.once("singleton", callback);

		//still loading? add listener to event emitter
		if(loading) {
			return;
		}

		loading = true;

		args = Array.prototype.slice.call(arguments, 0);
		cb = function() {
			singletonArgs = Array.prototype.slice.call(arguments, 0);
			em.emit.apply(em, ["singleton"].concat(singletonArgs));
		};


		//remove the callback
		args.pop();

		//and replace it.
		args.push(cb);

		//returned a value? Then it's not async...
		fn.apply(this, args);
		return this;
	};


	asyngleton.reset = function() {

		loading       = false;
		ret           = undefined;
		singletonArgs = undefined;

		return asyngleton;
	};

	return asyngleton;
}

/**
 */

function createDictionary() {

	var _dict = {};

	return {
		get: function(key, fn) {
			if(_dict[key]) return _dict[key];

			var asyngleton = _dict[key] = singleton(fn);

			asyngleton.dispose = function() {
				delete _dict[key];
			}

			return asyngleton;
		}
	}
}

/**
 */

function structrFactory(that, property, value) {

	return singleton(value);
}

/**
 */


module.exports            = singleton;
module.exports.dictionary = createDictionary;


//for structr
module.exports.type       = "operator";
module.exports.factory    = structrFactory;

    return module.exports;
});