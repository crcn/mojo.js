var views = require("../../.."),
expect    = require("expect.js");

describe("base/parent-child/events#", function () {

  it("can bubble an event", function () {

    var i = 0;

    var a = new views.Base({ }),
    b     = new views.Base({ parent: a }),
    c     = new views.Base({ parent: b });


    a.once("event", function (v) {
      expect(i).to.be(2);
      i++;
      expect(v).to.be("a");
    });

    b.once("event", function (v) {
      expect(i).to.be(1);
      i++;
      expect(v).to.be("a");
    });

    c.once("event", function (v) {
      i++;
      expect(v).to.be("a");
    });

    c.bubble("event", "a");
    expect(i).to.be(3);
  });

  it("doesn't bubble an event if there is no parent", function () {

    var i = 0;

    var a = new views.Base({ name: "a" });


    a.once("event", function (v) {
      i++;
      expect(v).to.be("a");
    });

    a.bubble("event", "a");
    expect(i).to.be(1);
  });
});