var _parsers = [],
fs = require("fs"),
mustache = require("mustache"),
ejs      = require("ejs"),
handlebars = require("handlebars");

module.exports = function(templateData) {


	return function(options, next) {

		var parser;

		for(var i = _parsers.length; i--;) {
			
			parser = _parsers[i];
			if(parser.test(options.source)) break;
		}

		if(i < 0) return next();


		fs.readFile(options.source, "utf8", function(err, content) {

			parser.parse(content, templateData, function(content) {

				fs.writeFile(options.destination.replace("." + parser.type, ""), content, function() {
					next(false);
				});

			});

		});
	}

}


var use = module.exports.use = function(type, parser) {
	
	var regex = new RegExp("\\."+ type + "(\\.|$)");

	_parsers.push({ parse: parser, type: type, test: function(file) {
		return regex.test(file);
	}});

}



use("mu", function(content, data, next) {

	next(mustache.to_html(content, data));

});

use("hb", function(content, data, next) {

	next(handlebars.compile(content)(data));

});

use("ejs", function(content, data, next) {

	next(ejs.render(content, { data: data }));

});