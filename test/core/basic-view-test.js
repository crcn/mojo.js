
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
    // expect(view.models).to.be(app.models);
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

  it("returns a fragment on render", function () {
    expect(new mojo.View({}, app).render().nodeType).to.be(11);
  })

  /**
   */

   it("has the right info from app", function () {
    var view = app.createView("basic");
    expect(view.application).to.be(app);
    expect(view._cid).not.to.be(undefined);
   });

   /**
    */

  it("the context of view is itself", function () {
    var view = app.createView("basic");
    expect(view.context()).to.be(view);
  });

  /**
   */

  it("can create a view with options", function () {
    var view = app.createView("basic", { name: "blah" });
    expect(view.get("name")).to.be("blah");
  })

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

  it("can render a view", function () {
    var view = app.createView("basic");
    view.render();
  })

  /**
   */

  it("can remove a view", function () {
    var view = app.createView("basic");
    view.render();
    view.remove()
  });

  /**
   */

  it("can listen for a render event", function () {
    var render, rendered;
    var view = app.createView("basic");
    view.on("render", function () {
      render = true;
    });
    view.render();
    expect(render).to.be(true);
  });

  /**
   */

  it("can listen for a remove event", function () {
    var view = app.createView("basic"), remove, removed;
    view.render();
    view.on("remove", function () {
      remove = true;
    });
    view.remove();
    expect(remove).to.be(true);
  });

  /**
   */

  it("cannot re-render a view", function () {
    var view = app.createView("basic"), emitted = 0;
    view.on("render", function () {
      emitted++;
    });
    view.render();
    expect(view.render().nodeType).to.be(11);
    expect(emitted).to.be(1);
  });

  /**
   */


  it("cannot remove a view before it's rendered", function () {
    var view = app.createView("basic"), emitted;
    view.once("remove", function () {
      emitted = false;
    })
    view.remove();
    expect(emitted).to.be(undefined);
  });


  /**
   */

  it("maintains listeners on remove()", function () {
    var view = app.createView("basic"), emitted;
    view.on("blah", function () {
      emitted = true;
    });
    view.render();
    view.remove();
    view.emit("blah");
    expect(emitted).to.be(true);
  });

  /**
   * doesn't apply anymore - listeners stick around on dispose()
   */

  /*it("removes listeners on dispose()", function () {
    var view = app.createView("basic"), emitted;
    view.on("blah", function () {
      emitted = true;
    });
    view.render();
    view.dispose();
    view.emit("blah");
    expect(emitted).to.be(undefined);
  });*/

  /**
   */

  it("can attach to a an element", function () {
    var view = new mojo.View({}, app), 
    appended = 0;
    view.__decorators = undefined;

    view.attach({
      appendChild: function (frag) {
        expect(frag.nodeType).to.be(11);
        appended++;
      }
    });
    view.attach([{
      appendChild: function (frag) {
        expect(frag.nodeType).to.be(11);
        appended++;
      }
    }]);

    expect(appended).to.be(2);
  });

  /**
   */

  it("can render() a view after it's been dispose()d", function () {
    var view = new mojo.View({}, app);
    view.__decorators = undefined;
    view.render();
    view.dispose();
  })
}); 