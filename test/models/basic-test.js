var mojo = require("../.."),
expect   = require("expect.js");

describe("models#", function () {
  it("has the namespace", function () {
    expect(mojo.models).not.to.be(void 0);
  });
});