var expect = require("expect.js"),
mojo       = require("../..");


describe("core/sections#", function () {

  var app = new mojo.Application(), 
  app2 = new mojo.Application();
  app.registerViewClass("basic", mojo.View);
  app2.registerViewClass("basic", mojo.View);

  /*
  - registered component
  - class reference
  - custom component
  - createFragment set on view
  - decorate on initialize
  */


  it("can define a section with a class", function (next) {

    var ParentView = mojo.View.extend({
      sections: {
        child: mojo.View
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

}); 