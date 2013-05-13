var EventEmitter = require("events").EventEmitter;

var singletonIndex = 0;

/**
 */

function singleton(resetEachCall, fn) {

	if(arguments.length == 1) {
		fn = resetEachCall;
		resetEachCall = false;
	}

	var _id = singletonIndex++;

	var asyngleton = function() {

		var asyng = asyngleton.info.call(this), self = this;


		var args, cb, callback = arguments[arguments.length - 1];

		if(!(typeof callback == "function")) {
			callback = function(){ };
		}

		//result already set? return the value
		if(asyng.result) {
			callback.apply(this, asyng.result);
			return this;
		}



		asyng.em.once("singleton", callback);

		//still loading? add listener to event emitter
		if(asyng.loading) {
			return this;
		}

		asyng.loading = true;

		args = Array.prototype.slice.call(arguments, 0);
		cb = function() {
			var result = asyng.result = Array.prototype.slice.call(arguments, 0);
			if(resetEachCall) {
				asyngleton.reset.call(self);
			}
			asyng.em.emit.apply(asyng.em, ["singleton"].concat(result));
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

		var asyng = asyngleton.info.call(this);

		asyng.loading = false;
		asyng.result  = undefined;

		return asyngleton;
	};


	asyngleton.info = function() {
		if(!this._asyngleton) {
			this._asyngleton = {
			};
		}


		var asyng;

		if(!(asyng = this._asyngleton[_id])) {
			asyng = this._asyngleton[_id] = {
				result: null,
				loading: false,
				em: new EventEmitter()
			}
		}

		return asyng;
	}

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