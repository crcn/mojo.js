var views = require("../../.."),
expect    = require("expect.js");

describe("base/core/events#", function () {

  it("properly emits 'render'", function () {
    var i = 0;
    var view = new views.Base();

    view.on("render", function () {
      i++;
    });

    view.render();
    expect(i).to.be(1);
  });

  it("properly emits 'remove'", function () {
    var i = 0;
    var view = new views.Base();

    view.on("remove", function () {
      i++;
    });

    view.render();
    expect(i).to.be(0);
    view.remove();
    expect(i).to.be(1);
    view.remove();
    expect(i).to.be(1);
  });

  it("properly emits 'decorate' before rendering", function () {
    var de = 0, re = 0;
    var view = new views.Base();
    view.on("decorate", function () {
      de++;
    })
    view.on("render", function () {
      expect(de).to.be(1);
      re++;
    });

    view.render();
    expect(de).to.be(1);
    expect(re).to.be(1);
  });

  it("properly emits 'dispose'", function () {
    var de = 0;

    var view = new views.Base();
    view.on("dispose", function () {
      de++;
    });

    view.dispose();
  });

  it("doesn't emit 'remove' if disposed and not rendered", function () {
    var de = 0;

    var view = new views.Base();
    view.on("remove", function () {
      de++;
    });

    view.dispose();
    expect(de).to.be(0);
  });

  it("properly emits 'remove' when disposed", function () {
    var de = 0;

    var view = new views.Base();
    view.on("remove", function () {
      de++;
    });

    view.render();
    view.dispose();
    expect(de).to.be(1);
  });


  it("maintains the view listeners after its been disposed", function () {
    var e = 0;
    var view = new views.Base();
    view.on("event", function () {
      e++;
    });

    view.dispose();
    view.emit("event");
    expect(e).to.be(1);
  })


});