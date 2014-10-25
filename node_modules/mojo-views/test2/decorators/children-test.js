var expect = require("expect.js"),
mojoViews       = require("../.."),
paperclip  = require("paperclip");


describe("decorators/children#", function () {

  var app = mojoViews.mainApplication, 
  app2 = mojoViews.mainApplication;
  app.views.register("basic", mojoViews.Base);
  app2.views.register("basic", mojoViews.Base);

  



  it("can re-render a section", function () {
    var view = new mojoViews.Base({
      paper: paperclip.compile(
        "{{ html: children.child }}"
      )
    }, app).decorate({
      children: {
        child: {
          type: mojoViews.Base.extend({
            paper: paperclip.compile("hi mojoViews")
          })
        }
      }
    }), child;

    expect(view.render().toString()).to.be("hi mojoViews");
    (child = view.get("children.child")).remove();
    child.render();
  });


  // tests to make sure that children is overwritten entirely when
  // decorated

  it("maintains children when view is instantiated multiple times", function () {
    var SubView = mojoViews.Base.extend({
      paper: paperclip.compile("sub: {{ html: children.child }}"),
      children: {
        child: mojoViews.Base.extend({
          paper: paperclip.compile("Hello subview")
        })
      }
    });


    var v = new SubView({}, app);
    expect(v.render().toString()).to.be("sub: Hello subview");
    v.set("children.child", undefined);
    var v = new SubView({}, app);
    expect(v.render().toString()).to.be("sub: Hello subview");
  });

}); 