var views = require("../../.."),
expect    = require("expect.js"),
Application = require("mojo-application");

describe("base/core/basic#", function () {

  it("can create a new view with the default application", function () {
    var view = new views.Base();
    expect(view.application).to.be(void 0);
    view.render();
    expect(view.application).to.be(views.mainApplication);
  });

  it("throws an error if the first param isn't an object", function () {
    try {
      new views.Base("abba");
    } catch (e) {
      expect(e.message).to.contain("must be an object");
    }
  })

  it("can create a new view with a specific application", function () {
    var app,
    view = new views.Base(null, app = Application.main);
    expect(view.application).to.be(app);
  });

  it("properly initializes a view with all the passed in properties", function () {
    var view = new views.Base({ a: "b", c: "d" });
    expect(view.a).to.be("b");
    expect(view.c).to.be("d");
  });

  it("has a 'this' property", function () {
    var view = new views.Base();
    expect(view["this"]).to.be(view);
  });

  it("cannot override the 'this' property from the constructor", function () {
    var view = new views.Base({ this: {} });
    expect(view["this"]).to.be(view);
  });

  it("can add a disposable item, and get disposed when the view is disposed", function () {
    var i = 0;
    var view = new views.Base();
    view.disposable({
      dispose: function () {
        i++;
      }
    });

    view.dispose();
    expect(i).to.be(1);
    view.dispose();
    expect(i).to.be(1);
  }); 
});