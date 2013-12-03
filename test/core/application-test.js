var expect = require("expect.js"),
mojo       = require("../.."),
bindable   = require("bindable");


describe("core/application#", function () {

  /**
   */

  it("can create a new application", function () {
    var app = new mojo.Application();
    expect(app.models).not.to.be(undefined);
  });

  /**
   */

  it("can use a plugin", function () {
    var app = new mojo.Application();
    app.use(function (app) {
      app.plugin = true;
    });
    expect(app.plugin).to.be(true);
  });

  /**
   */

  it("can register a view", function () {
    var app = new mojo.Application(), v;
    app.registerViewClass("main", mojo.View);
    expect(app.getViewClass("main")).to.be(mojo.View);
    expect((v = app.createView("main")).constructor).to.be(mojo.View);
    expect(v.application).to.be(app);
  }); 

  /**
   */

  it("can register a model", function () {
    var app = new mojo.Application(), v;
    app.registerModelClass("main", bindable.Object);
    expect((v = app.createModel("main")).constructor).to.be(bindable.Object);
  });
});