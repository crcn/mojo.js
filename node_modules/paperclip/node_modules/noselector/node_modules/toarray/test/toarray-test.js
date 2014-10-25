var expect = require("expect.js"),
toarray = require("..");

describe("toarray", function() {
  it("can convert an object to an array", function() {
    expect(toarray(5)[0]).to.be(5)
  });

  it("doesn't convert an array", function() {
    expect(toarray([5])[0]).to.be(5)
  });

  it("ignores undefined values", function() {
    expect(toarray(undefined).length).to.be(0)
  })
});
