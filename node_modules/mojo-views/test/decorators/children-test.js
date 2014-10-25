var expect = require("expect.js"),
views      = require("../.."),
Application = require("mojo-application");


describe("decorators/children#", function () {

  it("can define a section with a class", function () {

    var v = new views.Base().decorate({
      children: {
        child: views.Base
      }
    })

    v.render();
    expect(v.get("children.child").constructor).to.be(views.Base);
  });


  it("can define a section when the type is a class", function () {
    var v = new views.Base().decorate({
      children: {
        child: {
          type: views.Base,
          a: "b"
        }
      }
    })

    v.render();
    expect(v.get("children.child").constructor).to.be(views.Base);
    expect(v.get("children.child.a")).to.be("b");
    expect(v.get("children.child.name")).to.be("child");
  });

  it("can define a section when the type is a registered component", function () {

    var a = new Application();
    a.use(views);
    a.views.register("basic", views.Base);

    var v = new views.Base(null, a).decorate({
      children: {
        child: "basic",
        child2: { type: "basic", a: "b" }
      }
    })

    v.render();
    expect(v.get("children.child").constructor).to.be(views.Base);
    expect(v.get("children.child2").constructor).to.be(views.Base);
    expect(v.get("children.child2.a")).to.be("b");
  });


  it("can define a section when it's a view object", function () {
    var p = new views.Base().decorate({
      children: {
        child: new views.Base()
      }
    });
    p.render();
    expect(p.get("children.child").constructor).to.be(views.Base);
  })


  it("defaults to base view type if type isn't present", function () {
    var p = new views.Base().decorate({
      children: {
        child: {
          message: "abba"
        }
      }
    });
    p.render();
    expect(p.get("children.child").constructor).to.be(views.Base);
    expect(p.get("children.child.message")).to.be("abba");
  });

  it("throws an error if the type is not found", function () {

    var error;
    
    try {
        var v = new views.Base().decorate({
        children: {
          child: "404"
        }
      })

      v.render();
    } catch(e) {
      error = e;
    }

    expect(error.message).to.contain("doesn't exist");
  });

  it("throws an error if the options is an incorrect type", function () {
    
    try {
        var v = new views.Base().decorate({
        children: {
          child: 434423
        }
      })

      v.render();
    } catch(e) {
      error = e;
    }


    expect(error.message).to.contain("cannot create child");
  });

  it("throws an error if the options is invali", function () {
    
    try {
        var v = new views.Base().decorate({
        children: {
          child: void 0
        }
      })

      v.render();
    } catch(e) {
      error = e;
    }


    expect(error.message).to.contain("is invalid for view");
  });
});