var expect = require("expect.js"),
mojo       = require("../..");


describe("core/sections#", function () {

  var app = new mojo.Application(), 
  app2 = new mojo.Application();
  app.registerViewClass("basic", mojo.View);
  app2.registerViewClass("basic", mojo.View);


  it("can define a section with a class", function (next) {

    var ParentView = mojo.View.extend({
      sections: {
        child: mojo.View
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app), c;
    p.render(function () {
      expect((c = p.get("sections.child")).constructor).to.be(mojo.View);
      next();
    });
  });

  /**
   */

  it("can define a section when the type is a class", function (next) {

    var ParentView = mojo.View.extend({
      sections: {
        child: {
          type: mojo.View,
          message: "blah"
        }
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app);

    p.render(function () {
      expect(p.get("sections.child").constructor).to.be(mojo.View);
      expect(p.get("sections.child").message).to.be("blah");
      next();
    });
  });

  /**
   */

  it("can define a section when the type is a registered component", function (next) {
    var ParentView = mojo.View.extend({
      sections: {
        child: {
          type: "basic"
        }
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app);

    p.render(function () {
      expect(p.get("sections.child").constructor).to.be(mojo.View);
      next();
    });
  });

  /**
   */

  it("initializes the child only when createFragment() is called", function (next) {
    var ParentView = mojo.View.extend({
      sections: {
        child: {
          type: mojo.View,
          sections: {
            subb: mojo.View
          }
        }
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app);

    p.render(function () {
      var c = p.get("sections.child");
      expect(c.get("sections.subb")).to.be(mojo.View);
      expect(c.get("states.render")).to.be(undefined);
      c.createFragment();
      expect(c.get("states.render")).to.be(true);
      expect(c.get("sections.subb").constructor).to.be(mojo.View);
      next();
    });
  });

}); 