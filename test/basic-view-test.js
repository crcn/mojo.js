var expect = require("expect.js"),
mojo       = require("..");


describe("basic/view#", function () {

  var app = new mojo.Application();
  app.registerViewClass("basic", mojo.View);

  // - render multiple
  // - remove before render
  // - setChild test
  // - bubble test
  // - onRemove event
  // - onRender event
  // - callstack onRender event
  // - callstack onRemove event
  // - bind parent event
  // - path test
  // - _id test
  // - view obj error test

  /**
   */

   it("has the right info from app", function () {
    var view = app.createView("basic");
    expect(view.models).to.be(app.models);
    expect(view.application).to.be(app);
   });

   /**
    */

  it("the context of view is itself", function () {
    var view = app.createView("basic");
    expect(view.context()).to.be(view);
  })

   /**
    */

  it("can render a view asynchronously", function(next) {
    var view = app.createView("basic");
    view.render(function () {
      expect(view.get("states.rendered")).to.be(true);
      expect(view.get("states.render")).to.be(true);
      next();
    });
  });

  /**
   */

  it("can render a view synchronously", function () {
    var view = app.createView("basic");
    view.render();
    expect(view.get("states.rendered")).to.be(true);
    expect(view.get("states.render")).to.be(true);
  })

  /**
   */

  it("can remove a view", function (next) {
    var view = app.createView("basic");
    view.render(function () {
      view.remove(function () {
          expect(view.get("states.remove")).to.be(true);
          expect(view.get("states.removed")).to.be(true);
        next();
      });
    });
  });

  /**
   */

  it("cannot remove a view before it's rendered", function (next) {
    var view = app.createView("basic");
    view.remove(function(err) {
      expect(err).not.to.be(undefined);
      next();
    });
  });

  /**
   */

  it("can listen for a render & rendered event", function () {
    var render, rendered;
    var view = app.createView("basic");
    view.on("render", function () {
      render = true;
    });
    view.on("rendered", function () {
      rendered = true;
    });
    view.render();
    expect(render).to.be(true);
    expect(rendered).to.be(true);
  });

  /**
   */

  it("can listen for a remove & removed event", function () {
    var view = app.createView("basic"), remove, removed;
    view.render();
    view.on("remove", function () {
      remove = true;
    });
    view.on("removed", function () {
      removed = true;
    });
    view.remove();
    expect(remove).to.be(true);
    expect(removed).to.be(true);
  });


}); 