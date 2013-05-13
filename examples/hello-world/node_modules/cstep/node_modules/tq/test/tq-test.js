var tq = require("../"),
expect = require("expect.js");

describe("tq", function() {

  var q;

  it("can create a tiny queue", function() {
    q = tq.create().start();
  });


  it("can call 'push'", function(next) {
    q.push(function(n) {
      n();
      next();
    });
  });

  it("can call 'then'", function(next) {
    q.then(next);
  });

  it("can call 'wait'", function(next) {
    process.nextTick(q.wait());
    q.then(next);
  });

  it("can prematurely call 'wait'", function(next) {
    q.push(function(n) {
      process.nextTick(n);
    });
    q.wait()();
    q.then(next);
  }); 

  it("can call 'unshift'", function(next) {
    var i = 0;
    q.stop();
    q.push(function(next) {
      expect(i++).to.be(1);
      next();
    });
    q.unshift(function(next) {
      expect(i++).to.be(0);
      next();
    });
    q.push(function(next) {
      expect(i++).to.be(2);
      next();
    });
    q.then(next);
    q.start();
  });

  it("can call 'now'", function(next) {

    var i = 0;

    q.push(function(next) {
      q.now(function() {
        q.then(function() {
          i++;
        });
        q.push(function(next) {
          i++;
          process.nextTick(next);
        });
        q.wait()();
      });

      next();
    });

    q.then(function() {
      expect(i).to.be(2);
    });
    q.then(next);

  });


  it("can call 'now' 2", function(next) {
    var i = 0;
    q.push(function(next) {
      q.now(function(q) {
        q.then(function() {
          i++;
        });
        q.push(function(next) {
          i++;
          process.nextTick(next);
        });
        q.then(next);
      });
    });

    q.then(function() {
      expect(i).to.be(2);
    });
    q.then(next);
  });

  it("can call 'now' 3", function(next) {
    var i = 0;
    q.push(function(next) {
      q.now(function(q) {
        q.then(function() {
          i++;
        });
        q.push(function(next) {
          i++;
          process.nextTick(next);
        });
        q.then(function(){});
        next();
      });
    });

    q.then(function() {
      expect(i).to.be(2);
    });

    q.then(next);
  });

  it("can set a timeout", function(next) {
    var q = tq.create().start().timeout(1);
    q.once("error", function(e) {
      expect(e.message).to.be("Timeout");
      next();
    });
    q.push(function(next) {
      setTimeout(next, 2);
    });
  });

  it("can handle an exception and still continue", function(next) {
    var q = tq.create().start();
    q.once("error", function() {

    });
    q.push(function(next) {
      throw new Error("fail");
    });
    q.push(function() {
      next();
    });
  });

});