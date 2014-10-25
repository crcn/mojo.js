var views = require("../../.."),
expect    = require("expect.js");

describe("base/parent-child/scope#", function () {

  it("can properly inherit a property from the parent", function () {
    var a = new views.Base({ name: "abba" }),
    b     = new views.Base({ parent: a    }),
    c     = new views.Base({ parent: b    });

    expect(b.get("name")).to.be("abba");
    expect(c.get("name")).to.be("abba");
  });

  it("remains bound to the parent property", function () {
    var a = new views.Base({ name: "abba" }),
    b     = new views.Base({ parent: a    });

    expect(b.get("name")).to.be("abba");
    a.set("name", "baab");
    expect(b.name).to.be("baab");
  });

  it("breaks when a child view overrides an inherited property", function () {
    var a = new views.Base({ name: "abba" }),
    b     = new views.Base({ parent: a    });

    expect(b.get("name")).to.be("abba");
    b.set("name", "baab");
    expect(b.name).to.be("baab");
    expect(a.name).to.be("abba");
    a.set("name", "cddc");
    expect(b.name).to.be("baab");
  });

  it("can inherit a path", function () {

    var a = new views.Base({ a : { b: { c: "d" }} }),
    b     = new views.Base({ parent: a    });

    expect(b.get("a.b.c")).to.be("d");
    a.set("a.b", "c");
    expect(b.get("a.b")).to.be("c");
  });

  it("doesn't break property scope when a child sets a property on an inherited object", function () {
    
    var a = new views.Base({ a : { b: { c: "d" }} }),
    b     = new views.Base({ parent: a    });

    expect(b.get("a.b.c")).to.be("d");
    b.set("a.b", "c");
    expect(a.get("a.b")).to.be("c");
  });

  it("inherits properties on set() if no dot", function () {


    var a = new views.Base({ a : { b: "c" }}),
    b     = new views.Base({ parent: a    });

    b.set("a.b", "d");
    expect(a.get("a.b")).to.be("d");
  });

  it("doesn't inherit properties on set() if no dot", function () {

    var a = new views.Base({ a : "b" }),
    b     = new views.Base({ parent: a    }),
    i = 0;

    b.bind("a", function (v) {
      expect(v).to.be("c");
      i++;
    });

    b.set("a", "c");
    expect(i).to.be(1);
  });

  it("doesn't inherit a propertly if defined", function () {
    var a = new views.Base({ a : "b" }),
    b     = new views.Base({ parent: a  });

    b._define("a");

    expect(b.get("a")).to.be(void 0);
  });

  it("doesn't inherit a propertly if defined as undefined in the prototype", function () {
    var a = new views.Base({ a : "b" }),
    B     = views.Base.extend({
      a: void 0
    });

    var b = new B({ parent: a });


    expect(b.get("a")).to.be(void 0);
  });

  it("can change inheritance if the parent changes", function () {
    var p1 = new views.Base({ a : "b" }),
    p2     = new views.Base({ a : "c" }),
    c      = new views.Base({ parent: p1 });

    expect(c.get("a")).to.be("b");
    c.set("parent", p2);
    expect(c.a).to.be("c");
  });

  it("binds inherited functions to the proper context", function () {

    var i = 0;
    var a = new views.Base({ a: 
      function () {
        i++;
        expect(this).to.be(a);
      } 
    }),
    b     = new views.Base({ parent: a  });

    b.get("a").call(b);
    b.get("a").call();
    expect(i).to.be(2);
  });

  /**
   */

  it("sub classes inherit defined props", function () {
    var PV = views.Base.extend({
      define: ["abba"]
    }),
    CV = PV.extend({
      define: ["bbaa"]
    });

    var v = new CV();
    expect(v.define).to.contain("parent");
    expect(v.define).to.contain("abba");
    expect(v.define).to.contain("bbaa");
    expect(v.define).to.contain("sections");
    expect(v.define).to.contain("children");
    expect(v._defined).to.have.keys("parent", "abba", "bbaa", "sections", "children");
  });
});