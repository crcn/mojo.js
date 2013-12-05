
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
    expect(child.models).to.be(app.models);

    expect(child2.parent).to.be(parent); 
    expect(child2.application).to.be(app);
    expect(child2.models).to.be(app.models);
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
    expect(child.models).to.be(app2.models);
    expect(subChild.application).to.be(app2);
    expect(subChild.models).to.be(app2.models);
    expect(subSubChild.application).to.be(app2);
    expect(subSubChild.models).to.be(app2.models);

    parent.setChild("someChild", child);

    expect(child.application).to.be(app);
    expect(child.models).to.be(app.models);
    expect(subChild.application).to.be(app);
    expect(subChild.models).to.be(app.models);
    expect(subSubChild.application).to.be(app);
    expect(subSubChild.models).to.be(app.models);
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

  it("removes the child if the parent is removed", function () {
    var parent = app.createView("basic"),
    child      = app.createView("basic");

    child.render();
    parent.setChild("child", child);
    parent.render();

    parent.remove();
    expect(child.section).to.be(undefined);
  });

  /**
   */

  it("disposes the child if the parent is disposed", function () {
    var parent = app.createView("basic"),
    child      = app.createView("basic");

    child.render();
    parent.setChild("child", child);
    parent.render();

    // still triggers .remove()
    parent.dispose();

    expect(child._fresh).to.be(true);
    expect(child.section).to.be(undefined);

  });

  /**
   */

  it("properly disposes the child if the parent is switched", function () {
    var p1 = app.createView("basic"),
    p2     = app.createView("basic"),
    child  = app.createView("basic");

    p1.render(); p2.render(); child.render();

    p1.setChild("child", child);
    p2.setChild("child", child);

    p1.dispose();
    p2.dspo

    expect(child.section).not.to.be(undefined);
    p2.dispose();
    expect(child.section).to.be(undefined);
  })

}); 