var expect = require("expect.js"),
mojo       = require("../..");


describe("decorators/sections#", function () {

  var app = new mojo.Application(), 
  app2 = new mojo.Application();
  app.registerViewClass("basic", mojo.View);
  app2.registerViewClass("basic", mojo.View);


  it("can define a section with a class", function () {

    var ParentView = mojo.View.extend({
      sections: {
        child: mojo.View
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app), c;
    p.render();
    expect((c = p.get("sections.child")).constructor).to.be(mojo.View);
    
  });

  /**
   */

  it("can define a section when the type is a class", function () {

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

    p.render();
    expect(p.get("sections.child").constructor).to.be(mojo.View);
    expect(p.get("sections.child").message).to.be("blah");
  });

  /**
   */

  it("can define a section when the type is a registered component", function () {
    var ParentView = mojo.View.extend({
      sections: {
        child: {
          type: "basic"
        }
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app);
    p.render();
    expect(p.get("sections.child").constructor).to.be(mojo.View);
  });


}); 