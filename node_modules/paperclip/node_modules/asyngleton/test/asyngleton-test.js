var expect = require("expect.js"),
structr = require("structr"),
asyngleton = require("../");

describe("asyngleton", function() {

  var Person = structr({
    "__construct": function() {
      this._getNameCount = 0;
    },
    "getName": asyngleton(function(callback) {
      this._getNameCount++;
      setTimeout(callback, 1, "craig");
    }),
    "getNameReset": asyngleton(true, function(callback) {
      this._getNameCount++;
      setTimeout(callback, 1, "craig" + this._getNameCount);
    })
  });

  it("can call getName a bunch of times and only be called once", function(next) {
    var person = new Person(),
    name;

    for(var i = 100; i--;) {
      person.getName(function(n) {
        name = n;
      });
    }

    setTimeout(function() {
      expect(person._getNameCount).to.be(1);
      expect(name).to.be("craig");
      next();
    }, 2);
  });

  it("can call getNameReset a bunch of times, and only be recalled after each time it successfuly calls", function(next) {
    var person = new Person(),
    name,
    i = 0;


    function tick() {
      person.getNameReset(function(n) {
        name = n;
      });
      if(++i < 50)
      setTimeout(tick, 2);
    }

    tick();

    setTimeout(function() {
      expect(person._getNameCount).to.be(50);
      expect(name).to.be("craig50");
      next();
    }, 1000);
  });
})