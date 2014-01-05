

var expect = require("expect.js"),
mojo       = require("../..");


describe("parent/child#", function () {

  var app = new mojo.Application(), 
  app2 = new mojo.Application();
  app.registerViewClass("basic", mojo.View);
  app2.registerViewClass("basic", mojo.View);

  /**
   */

  it("can set a child", function () {
    var parent = app.createView("basic"), 
    child = app.createView("basic"),

    // outside of application
    child2 = new mojo.View();

    parent.setChild("someChild", child);
    parent.setChild("someChild2", child2);

    expect(parent.get("sections.someChild")).to.be(child);
    expect(parent.get("sections.someChild2")).to.be(child2);

    expect(child.parent).to.be(parent); 
    expect(child.application).to.be(app);
    // expect(child.models).to.be(app.models);

    expect(child2.parent).to.be(parent); 
    expect(child2.application).to.be(app);
    // expect(child2.models).to.be(app.models);
  });


  /**
   */

  it("properly inherits application", function () {

    var parent  = app.createView("basic"),
    child       = app2.createView("basic"),
    subChild    = app2.createView("basic"),
    subSubChild = app2.createView("basic");

    child.setChild("someChild", subChild);
    subChild.setChild("subChild", subSubChild);

    expect(child.application).to.be(app2);
    // expect(child.models).to.be(app2.models);
    expect(subChild.application).to.be(app2);
    // expect(subChild.models).to.be(app2.models);
    expect(subSubChild.application).to.be(app2);
    // expect(subSubChild.models).to.be(app2.models);

    parent.setChild("someChild", child);

    expect(child.application).to.be(app);
    // expect(child.models).to.be(app.models);
    expect(subChild.application).to.be(app);
    // expect(subChild.models).to.be(app.models);
    expect(subSubChild.application).to.be(app);
    // expect(subSubChild.models).to.be(app.models);
  });

  /**
   */

  it("can bubble an event", function () {

    var parent = app.createView("basic"),
    child      = app.createView("basic"),
    subChild   = app.createView("basic"),
    bubbled;


    child.setChild("child", subChild);
    parent.setChild("child", child);

    parent.once("bubble", function (arg) {
      bubbled = arg;
    });

    subChild.bubble("bubble", "blah!");
    expect(bubbled).to.be("blah!");
  });

  /**
   */

  it("has the correct path", function () {
    var parent = app.createView("basic"),
    child      = app.createView("basic");
    parent.setChild("child", child);
    expect(child.path()).to.be("DecorableView.DecorableView");
  });

  /**
   */

  it("removes the child if the parent is removed", function (next) {
    var parent = app.createView("basic"),
    child      = app.createView("basic");

    child.render();
    parent.setChild("child", child);
    parent.render();

    parent.remove();


    setTimeout(function () {
      expect(child._rendered).to.be(false);
      next()
    }, 10)
  });

  /**
   */

  it("disposes the child if the parent is disposed", function (next) {
    var parent = app.createView("basic"),
    child      = app.createView("basic");

    child.render();
    parent.setChild("child", child);
    parent.render();

    // still triggers .remove()
    parent.dispose();

    setTimeout(function () {
      expect(child._rendered).to.be(false);
      next()
    }, 10)

  });

  /**
   */

  it("properly disposes the child if the parent is switched", function (next) {
    var p1 = app.createView("basic"),
    p2     = app.createView("basic"),
    child  = app.createView("basic");

    p1.render(); p2.render(); child.render();

    p1.setChild("child", child);
    p2.setChild("child", child);

    p1.dispose();
    p2.dspo

    expect(child._rendered).to.be(true);
    p2.dispose();
    setTimeout(function () {
      expect(child._rendered).to.be(false);
      next()
    }, 10)
  });

  /**
   * BUSTS
   */

  /*it("can re-use a view after it's been disposed, and maintains children", function () {

    var p = new mojo.View({
      sections: {
        child: mojo.View
      }
    }, app), c, cs, c2, cs2;

    p.__decorators = undefined;
    p.render();
    cs = (c = p.get("sections.child")).render();
    p.dispose();
    p.render();
    cs2 = (c2 = p.get("sections.child")).render();

    expect(c2).not.to.be(c);
    expect(cs2).not.to.be(c2);
  });*/

}); 