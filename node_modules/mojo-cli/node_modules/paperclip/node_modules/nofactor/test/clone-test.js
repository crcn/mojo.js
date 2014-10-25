var nf = require("..").default,
expect = require("expect.js");

describe("clone#", function () {

  /**
   */

  it("can clone an element", function () {
    var element = nf.createElement("div");
    element.setAttribute("class", "test");
    element.setAttribute("id", "test");
    element.setAttribute("style", "color: red; font-size: 20px;");
    expect(element.toString()).to.be(element.cloneNode().toString());
    expect(element).not.to.be(element.cloneNode())
  });

  /**
   */

  it("can clone an text node", function () {
    var text = nf.createTextNode("hello");
    expect(text.toString()).to.be(text.cloneNode().toString());
    expect(text).not.to.be(text.cloneNode())
  });

  /**
   */

  it("can clone an comment node", function () {
    var text = nf.createComment("hello");
    expect(text.toString()).to.be(text.cloneNode().toString());
    expect(text).not.to.be(text.cloneNode())
  });

  /**
   */

  it("can perform a deep clone", function () {
    var element = nf.createElement("div"),
    element2 = nf.createElement("span");

    element.appendChild(element2);
    expect(element.toString()).to.be(element.cloneNode().toString());
    expect(element.childNodes[0]).not.to.be(element.cloneNode().childNodes[0]);
  });

});