var expect = require("expect.js"),
mojo       = require("../..");


describe("parent/child#", function () {

  var app = new mojo.Application(), 
  app2 = new mojo.Application();
  app.registerViewClass("basic", mojo.View);
  app2.registerViewClass("basic", mojo.View);


  // - bubble
  // - parent defined
  // - inherit application, and models, parent, and _parent
  // - dispose child if parent disposed
  // - correct path
  // - can set child

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


}); 