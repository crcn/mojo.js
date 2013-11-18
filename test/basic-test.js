var mojo = require("..");

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


  it("can inherit the application ")
});