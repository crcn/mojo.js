
var expect = require("expect.js"),
mojo       = require("../.."),
bindable   = require("bindable");


describe("core/application#", function () {

  /**
   */

  it("can create a new application", function () {
    var app = new mojo.Application();
    expect(app.models).not.to.be(undefined);
    expect(app.models.constructor).to.be(bindable.Object);

    expect(app.getViewClass("list")).not.to.be(undefined);
    expect(app.getViewClass("states")).not.to.be(undefined);
    expect(app.getViewClass("base")).not.to.be(undefined);
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

  /**
   */

  it("throws an error if a view doesn't exist", function () {
    var app = new mojo.Application();

    try { 
      app.createView("doesNotExist");
    } catch (e) {
      expect(e.message).to.contain("doesn't exist");
    }
  })
});