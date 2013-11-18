var mojo = require(".."),
expect   = require("expect.js");

describe("basic#", function () {

  var app = new mojo.Application();

  /**
   */

  it("can create a basic view", function () {
    var view = app.createView("base");
  });

  /**
   */

  it("can listen for specific events", function (next) {
    var view = app.createView("base");

    view.on("render", function () {
      next()
    });

    view.render();
  });

  /**
   */

  it("application & models are not undefined", function (next) {
    var view = app.createView("base");
    expect(view.application).not.to.be(undefined);
    expect(view.models).not.to.be(undefined);
  });

  /**
   */


  it("can inherit the application", function() {
    
  });
});