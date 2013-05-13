var hoist = require("../"),
expect = require("expect.js");

describe("async", function() {
  it("can asynchronously cast a value", function(next) {
    hoist.cast(Number).map(function(value, next) {
      setTimeout(next, 1, null, 10);
    }).call(null, "5", function(err, value) {
      expect(value).to.be(10);
      next();
    });
  });

  /*it("can throw an error for an async cast", function() {
    var err;

    try {
      hoist.cast(Number).map(function(value, next) {
        setTimeout(next, 1, null, 10);
      }).call(null, "5");
    } catch(e) {
      err = e;
    }
    console.log(err.message)
    expect(err).not.to.be(null);
    expect(err.message).to.contain("cannot type-cast value synchronously with asynchronous transformer")
  });*/


  it("can asynchronously map multiple values", function(next) {
    hoist.cast(Number).map(function(value, next) {
      setTimeout(next, 1, null, 10);
    }).map(function(value, next) {
      expect(value).to.be(10);
      setTimeout(next, 1, null, 20);
    }).call(null, "5", function(err, value) {
      expect(value).to.be(20);
      next();
    });
  });
  
})