var expect = require("expect.js"),
mojo       = require("../..");


describe("core/basic-view#", function () {

  var app = new mojo.Application();
  app.registerViewClass("basic", mojo.View);

  // - cannot remove before render
  // - cannot render if rendered
  // - return doc fragment
  // - can re-render after remove



  /**
   */

  it("can create a view apart from the application", function () {
    var view = new mojo.View();
    expect(view.__isView).to.be(true);
    expect(view.application).to.be(undefined);
    expect(view.models).to.be(undefined);
  });

  /**
   */

  it("can pass appliation to the second param", function () {
    var view = new mojo.View({}, app);
    expect(view.application).to.be(app);
    expect(view.models).to.be(app.models);
  });

  /**
   */

  it("can extend a view", function () {
    var SubView = mojo.View.extend({ name: "blah!" }),
    v = new SubView();
    expect(v.constructor).to.be(SubView);
    expect(v.name).to.be("blah!");
  });

  /**
   */

   it("has the right info from app", function () {
    var view = app.createView("basic");
    expect(view.models).to.be(app.models);
    expect(view.application).to.be(app);
    expect(view.section).not.to.be(undefined);
    expect(view._id).not.to.be(undefined);
   });

   /**
    */

  it("the context of view is itself", function () {
    var view = app.createView("basic");
    expect(view.context()).to.be(view);
  });

  /**
   */

  it("throws an error if the first param isn't an object", function () {
    try {
      app.createView("basic", "bad arg");
    } catch (e) {
      expect(e.message).to.contain("must be an object");
    }
  })

  /**
   */

  it("has the right path", function () {
    expect(app.createView("basic").path()).to.be("DecorableView");
  });

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

  it("can listen for an initialize event", function (next) {
    var view = app.createView("basic");
    view.once("initialize", function () { 
      expect(view._initialized).to.be(true);
      next(); 
    });
    view.render();
  })

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

  /**
   */

  it("can add to the render callstack synchronously", function () {
    var view = app.createView("basic"), rendered;
    view.on("render", function () {
      view.callstack.push(function() {
        rendered = true;
      });
    });
    view.render();
    expect(rendered).to.be(true);
  });

  /**
   */

  it("can add to the render callstack asynchronously", function (next) {
    var view = app.createView("basic"), rendered;
    view.on("render", function () {
      view.callstack.push(function (next) {
        setTimeout(next, 0);
      });
      view.callstack.push(function () {
        rendered = true;
      })
    });
    view.render(function () {
      expect(rendered).to.be(true);
      next();
    });
    expect(rendered).to.be(undefined);
  });

  /**
   */

  it("can add to the remove callstack synchronously", function () {
    var view = app.createView("basic"), removed;
    view.render();
    view.on("remove", function () {
      view.callstack.push(function() {
        removed = true;
      });
    });
    view.remove();
    expect(removed).to.be(true);
  });

  /**
   */

  it("can add to the remove callstack asynchronously", function (next) {
    var view = app.createView("basic"), removed;
    view.on("remove", function () {
      view.callstack.push(function (next) {
        setTimeout(next, 0);
      });
      view.callstack.push(function () {
        removed = true;
      })
    });
    view.render();
    view.remove(function () {
      expect(removed).to.be(true);
      next();
    });
    expect(removed).to.be(undefined);
  });
}); 