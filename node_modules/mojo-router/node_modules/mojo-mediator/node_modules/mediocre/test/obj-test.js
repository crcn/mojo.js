var expect = require("expect.js"),
mediocre = require("..");

describe("pre/post#", function() {

  var mediator = mediocre();

  it("can call a listener from an object", function (next) {

    var buffer = "";


    mediator.on("test", function (message, next) {
      buffer += "a";
      expect(message.options.hello).to.be(true);
      next();
    });


    mediator.on("test3", function (message, next) {
      buffer += "c";
      next();
    });

    mediator.on("test2", { test: { hello: true }, test3: true }, { test3: false }, function (message, next) {
      buffer += "b";
      next();
    });

    mediator.execute("test2", function() {
      expect(buffer).to.be("accb");
      next();
    });
  });



  it("can run an async test", function (next) {

    var buffer = "";

    mediator.on("async", function (message, next) {
      buffer += "a";
      message.options.call(this, message.data, next);
    });

    function readFile(file, next) {
      buffer += "b";
      expect(file).to.be("a/b/c/d/e");
      next(null, "b");
    };

    mediator.on("readFile", { async: readFile });


    mediator.execute("readFile", "a/b/c/d/e", function (err, result) {
      expect(buffer).to.be("ab");
      expect(result).to.be("b");
      next();
    });
  });



});