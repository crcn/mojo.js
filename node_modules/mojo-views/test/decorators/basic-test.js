var views = require("../.."),
expect    = require("expect.js");

describe("decorators/basic#", function () {

  it("sets decorators from the view prototype", function () {
    var V = views.Base.extend({
      bindings: {
        a: "c"
      }
    });

    var view = new V({ a: "b" });
    view.render();
    expect(view.c).to.be("b");
    view.set("a", "d");
    expect(view.c).to.be("d");
  });
  
  it("can call decorate() before rendering, but doesn't trigger until rendering", function () {
    var view = new views.Base({ a: "b" });
    view.decorate({
      bindings: {
        a: "c"
      }
    });
    view.render();
    expect(view.c).to.be("b");
  });

  it("cannot call decorate() after rendering", function () {
    var view = new views.Base({ a: "b" });
    view.render();
    view.decorate({
      bindings: {
        a: "c"
      }
    });
    expect(view.c).to.be(void 0);
  });

  
});