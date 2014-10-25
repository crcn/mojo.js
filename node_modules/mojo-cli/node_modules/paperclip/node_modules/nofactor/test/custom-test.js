var expect = require("expect.js"),
nofactor   = require("..");


describe("custom#", function () {

	var custom = nofactor.custom(nofactor.string);


	it("can create a custom factory", function () {
		custom = nofactor.custom(nofactor.string);
	});

	it("can register a custom element", function () {
		custom.registerElement("br", nofactor.string.Element.extend({
			toString: function () {
				return "<" + this._name + " />";
			}
		}));
	});

	it("can create and stringify the registered element", function () {
		expect(custom.createElement("br").toString()).to.be("<br />");
	});

	it("can properly stringify the custom element when it's part of a div", function () {
		var div = custom.createElement("div");
		div.appendChild(custom.createElement("br"));
		expect(div.toString()).to.be("<div><br /></div>")
	})
});