var expect = require("expect.js"),
mediocre = require("..");

describe("pre/post#", function() {

  var mediator = mediocre();

  it("can register a listener", function() {
    mediator.on("test", function() {

    });
  });


  it("can execute a listener", function(next) {
    mediator.on("test", function(message, next) {
      next();
    });
    mediator.execute("test", next);
  });


  it("keeps a reference to the mediator", function(next) {
    mediator.on("test", function(message, next) {
      expect(message.mediator).to.be(mediator);
      next();
    });
    mediator.execute("test", next);
  });


  it("can chain commands together", function (next) {

    var buffer = "";

    mediator.on("a", function(message, next) {
      buffer += "a";
      next();
    }, function(message, next) {
      buffer += "b";
      next();
    })

    mediator.execute("a", function() {
      expect(buffer).to.be("ab");
      next();
    })
  });

  it("can add pre hooks onto a listener", function(next) {
    var buffer = "";
    mediator.on("pre test", function(message, next) {
      buffer += "b";
      next();
    });

    mediator.on("test", function(message, next) {
      buffer += "a";
      next();
    });

    mediator.execute("test", function() {
      expect(buffer).to.be("ba");
      next();
    })
  });


  it("add add post hooks onto a listener", function(next) {
    var buffer = "";
    mediator.on("post test", function(message, next) {
      buffer += "b"
      next();
    });

    mediator.on("test", function(message, next) {
      buffer += "a";
      next();
    });

    mediator.execute("test", function() {
      expect(buffer).to.be("ab");
      next();
    });
  });
});