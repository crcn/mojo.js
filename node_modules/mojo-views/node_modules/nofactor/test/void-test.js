// ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track"]

var nofactor = require(".."),
expect = require("expect.js");


describe("void#", function () {

	var voidElements = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track"];

	voidElements.forEach(function (nodeName) {
		it("properly prints for " + nodeName, function () {
			expect(nofactor["default"].createElement(nodeName).toString()).to.be("<" + nodeName + ">");
		});	
	});
});