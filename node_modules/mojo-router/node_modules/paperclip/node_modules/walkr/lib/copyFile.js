var fs          = require("fs");

module.exports = function(options, next) {
	
	if(options.stat.isDirectory() || !options.destination) return next();

	if(options.stat.isSymbolicLink()) {
		fs.symlink(fs.realpathSync(options.source), options.destination, next);
		return;
	}

	var istream = fs.createReadStream(options.source),
	ostream     = fs.createWriteStream(options.destination);

	istream.pipe(ostream);
	istream.once("end", next);

}