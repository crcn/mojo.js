var expect = require("expect.js"),
flatstack  = require("..");
flatstack.asyncLimit = 0;

describe("flatstack", function() {
  var queue = flatstack({ enforceAsync: true });

  it("can add, and run a list of functions synchronously", function() {
    var i = 0;
    queue.push(function() {
      i++;
    }, function() {
      i++;
    });

    expect(i).to.be(2);
  });

  it("can run a list of functions synchronously and call .complete() on finish", function(next) {
    queue.push(function() {

    }, function() {

    }).complete(next);
  });


  it("can run an asynchronous function, and enforce asynchronous behavior", function(next) {
    var now = Date.now();
    queue.push(function(next) {
      next();
    }).complete(function() {
      expect(Date.now()).not.to.be(now);
      next();
    });
  });


  describe("can inject a synchronous function", function() {

    describe("in a synchronous function", function() {
      it("at the beginning", function() {
        var buffer = "";

        queue.push(function() {
          buffer += "a";
          queue.unshift(function() {
            buffer += "b";
          });
        }, function() {
          buffer += "a";
        });

        expect(buffer).to.be("aba");
      });

      it("at the end", function() {
        var buffer = "";
        queue.push(function() {
          buffer += "a";
          queue.push(function() {
            buffer += "b";
          });
        }, function() {
          buffer += "a";
        });

        expect(buffer).to.be("aab");
      });

    })

    


    describe("in an asynchronous function", function() {
      it("at the beginning", function(next) {
        var buffer = "";

        queue.push(function(next) {
          buffer += "a";
          queue.unshift(function() {
            buffer += "b";
          });
          next();
        }, function() {
          buffer += "a";
        }).complete(function() {
          expect(buffer).to.be("aba");
          next();
        });

      });

      it("at the end", function(next) {
        var buffer = "";
        queue.push(function(next) {
          buffer += "a";
          queue.push(function() {
            buffer += "b";
          });
          next();
        }, function() {
          buffer += "a";
        }).complete(function() {
          expect(buffer).to.be("aab");
          next();
        });
      });
    })

  });


  
  describe("can inject an asynchronous function", function(next) {

    describe("in a synchronous function", function() { 
      it("at the beginning", function(next) {
        var buffer = "";
        queue.push(function() {
          buffer += "a";
          queue.unshift(function(next) {
            buffer += "b";
            next();
          });
        }, function() {
            buffer += "a";
        }).complete(function() {
          expect(buffer).to.be("aba");
          next();
        });
      });

      it("at the end", function() {
          var buffer = "";
          queue.push(function() {
            buffer += "a";
            queue.push(function(next) {
              buffer += "b";
              next();
            });
          }, function() {
              buffer += "a";
          }).complete(function() {
            expect(buffer).to.be("aab");
            next();
          });
      });
    });

    describe("in an asynchronous function", function() { 
      it("at the beginning", function(next) {
        var buffer = "";
        queue.push(function(next) {
          buffer += "a";
          queue.unshift(function(next) {
            buffer += "b";
            next();
          });
          next();
        }, function() {
            buffer += "a";
        }).complete(function() {
          expect(buffer).to.be("aba");
          next();
        });
      });

      it("at the end", function(next) {
          var buffer = "";
          queue.push(function(next) {
            buffer += "a";
            queue.push(function(next) {
              buffer += "b";
              next();
            });
            next();
          }, function() {
              buffer += "a";
          }).complete(function() {
            expect(buffer).to.be("aab");
            next();
          });
      });
    });
  });
  

  
});