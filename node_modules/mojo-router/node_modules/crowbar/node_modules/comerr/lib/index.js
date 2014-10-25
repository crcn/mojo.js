

var DEFAULT_CODES = {

	//http
	400: "Bad Request",
	401: "Unauthorized",
	402: "Payment Required",
	404: "Not Found",
	403: "Forbidden",
	408: "Timeout",
	423: "Locked", //locking user accounts
	429: "Too Many Requests",
	500: "Unknown",
	501: "Not Implemented", //use this for features not implemented yet

	//custom
	601: "Incorrect Input", //e.g: incorrect credentails
	602: "Invalid", //e.g: email is wrong
	604: "Already Exists", //e.g: name already taken
	605: "Expired",
	606: "Unable To Connect",
	607: "Already Called", //error for when a method can only be called once, and has already been called
	608: "Not Enough Info", //error happens when a form isn't filled out properly
	609: "Incorrect Type" //incorrect data type
};

exports.codes = {};
exports.byCode = {};

exports.register = function(codes) {
	Object.keys(codes).forEach(function(code) {


		var name  = codes[code],
		message   = name,
		className = name.replace(/\s+/g, ""),
		ccName    = className.substr(0, 1).toLowerCase() + className.substr(1)

		if(exports[className]) {
			throw new Error("Error code '" + code + "' already exists.");
		}

		function addInfo(err, tags) {
			err.code = code;
			err[ccName] = true;
			if(tags) err.tags = tags;
			return err;
		}

		var Err = exports[className] = function(message, tags) {

			Error.call(this, message);

			this.message = (message || name);
			this.stack = new Error(this.message).stack;
			addInfo(this);
		}

		Err.prototype = new Error();
		Err.prototype.constructor = Err;
		Err.prototype.name = name;

		exports.byCode[code]     = Err;
		exports.codes[className] = code;

		//newer - better support against browsers
		exports[ccName] = Err.fn = function(message, tags) {
			return addInfo(new Error(message || name), tags);
		}
	});
}


exports.fromCode = function(code, message) {
	var clazz = exports.byCode[Number(code)] || exports.Unknown;
	return clazz.fn(message);
}


exports.register(DEFAULT_CODES);

