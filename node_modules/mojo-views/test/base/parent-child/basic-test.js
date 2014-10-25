var views = require("../../.."),
expect    = require("expect.js"),
Application = require("mojo-application");

describe("base/parent-child/basic#", function () {

  it("can initialize a view with a parent", function () {
    var p = new views.Base(),
    c     = new views.Base({ name: "c", parent: p });

    expect(c.parent).to.be(p);
    expect(p.children.c).to.be(c);
  });

  it("can set() a parent", function () {
    var p = new views.Base(),
    c     = new views.Base({ name: "c" });

    c.set("parent", p);

    expect(c.parent).to.be(p);
    expect(p.children.c).to.be(c);
  }); 

  it("can set() a parent to undefined and dispose all ties to parent", function () {
    var p = new views.Base();
    c     = new views.Base({ parent: p });
    p.render();
    c.render();
    expect(c.visible).to.be(true)
    expect(c.parent).to.be(p);
    c.set("parent", void 0);
    p.dispose();
    expect(c.parent).to.be(void 0);
    expect(c.visible).to.be(true);
  });

  it("only sets 'visible' property on child if parent has been rendered", function () {
    var p = new views.Base(),
    c     = new views.Base({ parent: p });
    c.render();
    expect(c.visible).to.be(false);
    p.render();
    expect(p.visible).to.be(true);
    expect(c.visible).to.be(true);
  });

  it("has a proper path", function () {
    var a = new views.Base({ name: "a" }),
    b     = new views.Base({ name: "b", parent: a }),
    c     = new views.Base({ name: "c", parent: b });

    expect(a.path()).to.be("a");
    expect(b.path()).to.be("a.b");
    expect(c.path()).to.be("a.b.c");
  });

  it("properly inherits the application", function () {

    var a1 = new Application(),
    a2     = new Application();

    var p1 = new views.Base({ application: a1 }),
    p2     = new views.Base({ application: a2 }),
    c      = new views.Base({ parent: p1 });

    expect(c.application).to.be(a1);
    c.set("parent", p2);
    expect(c.application).to.be(a2);
  });

  it("properly sets the visibility property if the parent is removed", function () {
    var p1 = new views.Base(),
    p2     = new views.Base(),
    c      = new views.Base();

    p1.render(); p2.render(); c.render();


    c.set("parent", p1);
    c.set("parent", p2);


    p1.dispose();

    expect(c.visible).to.be(true);
    p2.dispose();
    expect(c.visible).to.be(false);
  });

  it("sets the parent to undefined when disposed", function () {
    var p = new views.Base(),
    c     = new views.Base({ parent: p });
    expect(c.parent).to.be(p);
    c.dispose();
    expect(c.parent).to.be(void 0);
  })
});