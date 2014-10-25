var views = require("../../.."),
expect    = require("expect.js");

describe("base/core/protected-methods#", function () {

  it("properly calls willRender() and didRender()", function () {
    var i = 0;
    var view = new views.Base({
      willRender: function () {
        expect(i).to.be(0);
        i++;
      },
      didRender: function () {
        expect(i).to.be(1);
        i++;
      }
    });

    expect(i).to.be(0);
    view.render();
    expect(i).to.be(2);
    view.render();
    expect(i).to.be(2);
  });

  it("properly calls didCreateSection()", function () {
    var i = 0;
    var view = new views.Base({
      didCreateSection: function () {
        i++;
      },
      willRender: function () {
        expect(i).to.be(1);
      }
    });

    expect(i).to.be(0);
    view.render();
    expect(i).to.be(1);
  });

  it("properly calls willRemove() and didRemove()", function () {
    var i = 0;
    var view = new views.Base({
      willRemove: function () {
        expect(i).to.be(0);
        i++;
      },
      didRemove: function () {
        expect(i).to.be(1);
        i++;
      }
    });

    expect(i).to.be(0);
    view.render();
    view.remove();
    expect(i).to.be(2);
    view.remove();
    expect(i).to.be(2);
  });
});