var structr = require("structr"),
asyngleton  = require("../"),
fs          = require("fs");

structr.mixin(asyngleton);


var TestClass = structr({

	/**
	 */

	"singleton readDir": function(next) {
		console.log("READ DIR")
		fs.readdir(__dirname, next);
	},

	/**
	 */

	"abstract test": function() {

	}

});


var Test2 = TestClass.extend({

});

return;


var tc = new TestClass();
tc.test();

tc.readDir(function(err, files) {
	console.log(files)
});

tc.readDir(function(err, files) {
	console.log(files)
});