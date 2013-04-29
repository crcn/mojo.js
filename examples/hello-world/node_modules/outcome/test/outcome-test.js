var EventEmitter = require("events").EventEmitter,
outcome = require("../"),
expect = require("expect.js");

describe("outcome", function() {
  var em = new EventEmitter();

  it("can re-route an error", function(done) {
    outcome.e(function(err) {
      expect(err).not.to.be(undefined);
      done()
    }).s(function() {
      done(new Error("didn't re-route properly"));
    })(new Error("fail!"));
  });

  it("can throw a global error if failed", function(done) {
    outcome.once("unhandledError", function(err) {
      expect(err).not.to.be(undefined);
      done();
    });

    outcome.s(function() {
      done("fail!");
    })(new Error("fail!"));
  });

  it("can re-route an error to an event emitter", function(done) {
    em.once("error", function(err) {
      expect(err).not.to.be(undefined);
      done();
    });

    outcome.e(em).s(function() {
      done(new Error("fail"));
    })(new Error("fail!"))
  });


  it("can wrap around an emitter and call multiple callbacks", function() {

    var calls = 0, cb;

    var o = outcome.e(em);
    em.on("error", cb = function(err) {
      expect(err).not.to.be(undefined);
      calls++;
    });


    o.s(function(){})(new Error("fail"));
    expect(calls).to.be(1);

    o.e(function(){}).s(function(){})(new Error("fail"));
    expect(calls).to.be(1);


    //sanity
    o.s(function(){})(new Error("fail"));
    expect(calls).to.be(2);

    //ignore undefined
    o.e(undefined).s(function(){})(new Error("fail"));


    em.removeListener("error", cb);
  });


  it("can properly re-route a thrown exception", function(done) {
    outcome.e(function(e) {
      expect(e.message).to.be("uh oh!");
      done();
    }).s(function() {
      throw new Error("uh oh!");
    })();
  });


  it("can pass values into the success callback", function(done) {
    outcome.e(done).s(function(v, v1, v2) {
      expect(v).not.to.be(undefined);
      expect(v1).not.to.be(undefined);
      expect(v2).not.to.be(undefined);
      done();
    })(null, 1, 2, 3);
  });
});