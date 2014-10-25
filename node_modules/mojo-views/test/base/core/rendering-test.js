var views = require("../../.."),
expect    = require("expect.js");

describe("base/core/rendering#", function () {

  it("doesn't call remove() if render() isn't called first", function () {
    var rm = 0, re = 0;
    var view = new views.Base({
      didRender: function () {
        re++;
      },
      didRemove: function () {
        rm++;
      }
    });

    view.remove();
    expect(rm).to.be(0);
    view.render();
    expect(re).to.be(1);
    view.remove();
    expect(rm).to.be(1);
    view.remove();
    expect(rm).to.be(1);
  });

  it("properly sets the visibility property", function () {
    var view = new views.Base();
    expect(view.visible).to.be(false);
    view.render();
    expect(view.visible).to.be(true);
    view.remove();
    expect(view.visible).to.be(false);
  });


  it("returns a fragment on render", function () {
    expect(new views.Base().render().nodeType).to.be(11);
  });


  it("returns a fragment on render twice", function () {
    var v = new views.Base();
    v.render();
    expect(v.render().nodeType).to.be(11);
  });

  it("can render() a view after it's been disposed", function () {
    var view = new views.Base();
    view.render();
    view.dispose();
  });
});