var expect = require("expect.js"),
mediocre = require("..");

describe("basic#", function() {

  it("can listen for loading/success/data", function (next) {

    var mediator = mediocre();
    mediator.on("hello", function (message, next) {
      setTimeout(function () {
          next(null, 55);
      }, 1);
    });

    var msg = mediator.execute("hello");
    expect(msg.get("error.message")).to.be(undefined);
    expect(msg.get("loading")).to.be(true);

    setTimeout(function () {
      expect(msg.get("loading")).to.be(false);
      expect(msg.get("data")).to.be(55);
      expect(msg.get("success")).to.be(true);
      next();
    }, 5);
  });

  it("can listen for error prop", function (next) {
    var mediator = mediocre();
    mediator.on("hello", function (message, next) {
      next(new Error("abb"));
    });

    var msg = mediator.execute("hello", function () {
      expect(msg.get("error.message")).to.be("abb");
      next();
    });
  });



});
