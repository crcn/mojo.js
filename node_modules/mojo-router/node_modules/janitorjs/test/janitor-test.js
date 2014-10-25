var expect = require("expect.js"),
janitor    = require("..");

describe("janitor#", function() {


  /**
   */

  it("can handle a function", function (next) {
    var j = janitor();
    j.add(next);
    j.dispose();
  });

  /**
   */

  it("can handle a dispose method", function (next) {
    var j = janitor();
    j.add({
      dispose: next
    });
    j.dispose();
  });

  /**
   */

  it("can remove an item from cleanup", function () {
    var j = janitor(), d, i = 0;
    j.add(d = {
      dispose: function() {
        i++;
      }
    });

    j.remove(d);
    j.dispose();
    expect(i).to.be(0);
  })

  /**
   */

  it("can handle multiple items", function () {
    var j = janitor(), i = 0;

    j.add(function () {
      i++;
    })

    j.add(function () {
      i++;
    });

    j.dispose();

    expect(i).to.be(2);
  });

  /**
   */

  it("can be re-used",  function () {
    var j = janitor(), i = 0;

    j.add(function () {
      i++;
    });

    j.dispose();

    expect(i).to.be(1);

    j.add(function () {
      i++;
    });

    j.dispose();

    expect(i).to.be(2);
  }); 

  /**
   */

  it("can handle intervals", function (next) {
    var j = janitor(), i = 0;

    j.addInterval(setInterval(function () {
      i++;
    }, 0));

    j.dispose();
    setTimeout(function () {
      expect(i).to.be(0);
      next();
    }, 10);
  });

  /**
   */

  it("can handle timeouts", function (next) {
    var j = janitor(), i = 0;

    j.addTimeout(setTimeout(function () {
      i++;
    }, 0));

    j.dispose();
    setTimeout(function () {
      expect(i).to.be(0);
      next();
    }, 10);
  });



});