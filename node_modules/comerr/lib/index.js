

var DEFAULT_CODES = {

	//http
	401: "Unauthorized",
	402: "Payment Required",
	404: "Not Found",
	403: "Forbidden",
	408: "Timeout",
	423: "Locked", //locking user accounts
	429: "Too Many Requests",
	500: "Unknown error",
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
exports.register = function(codes) {
	Object.keys(codes).forEach(function(code) {


		var name = codes[code],
		message  = name,
		className = name.replace(/\s+/g, "");

		if(exports[className]) {
			throw new Error("Error code '" + code + "' already exists.");
		}

		var Err = exports[className] = function(message, tags) {

			if(typeof message == "object") {
				tags = message;
				message = null;
			}


			Error.call(this, message);

			this.message = (message || name);
			this.code = code;
			this.tags = tags;
			this.stack = new Error(this.message).stack;
		}

		Err.prototype = new Error();
		Err.prototype.constructor = Err;
		Err.prototype.name = name;


		exports.codes[className] = code;
	});
}


exports.register(DEFAULT_CODES);

