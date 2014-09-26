var mojo = require("../.."),
expect   = require("expect.js");

describe("views#", function () {
  it("has the namespace", function () {
    expect(mojo.views).not.to.be(void 0);
  });
})