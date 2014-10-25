var expect = require("expect.js"),
mediocre = require("..");

describe("basic#", function() {

  it("can intercept a message matching a specific pattern", function (next) {
    var mediator = mediocre();
    mediator.on("hello", function (message, next) {
      next(new Error("abb"));
    });

    mediator.spy(function (data) {
      return data.redirect || data.successRedirect;
    }, function (message, listeners) {
      expect(message.data.redirect).to.be(true);
      next();
    });

    mediator.execute("hello", { redirect: true });
  });


  it("can push additional listeners with a spy function", function (next) {
    var mediator = mediocre();
    mediator.on("hello", function () {});
    mediator.spy(function(){ return true; }, function (message) {
      message.listeners.unshift(function (message) {
        next()
      })
    });
    mediator.execute("hello");
  });
});
