var expect = require("expect.js"),
Application = require("mojo-application"),
views       = require("mojo-views"),
router      = require(".."),
async       = require("async"),
bootstrap   = require("mojo-bootstrap");

async.setImmediate = async.nextTick = function (next) {
  next();
}

describe("basic#", function () {

  it("can include the router a basic application ", function () {
    var app = new Application();
    app.use(router);
  })

  it("can include the router in an application with mojo-views", function () {
    var app = new Application();
    app.use(views);
    app.use(router);
  });

  it("calls init on the router when bootstrap is called", function () {
    var app = new Application();
    app.use(bootstrap);
    app.use(views);
    app.use(router);

    var i = 0;

    app.router.on("init", function () {
      i++;
    }); 

    app.initialize();
    expect(i).to.be(1);
  });



  it("properly data-binds the current location info to models", function () {
    var app = new Application();
    app.use(views);
    app.use(router);

    app.router.add({
      "/a": {
        name: "a",
        states: {
          app: "a"
        }
      },
      "/b": {
        name: "b",
        states: {
          app: "b"
        }
      },
      "/:c": {
      }
    });

    app.router.redirect("a", { query: { b: "c" }});
    expect(app.get("models.states.app")).to.be("a");
    expect(app.get("models.query.b")).to.be("c");
    app.router.redirect("b");
    expect(app.get("models.states.app")).to.be("b");
    expect(app.get("models.query.b")).to.be("c");
    app.router.redirect("/c");
    expect(app.get("models.states.app")).to.be(void 0);
    expect(app.get("models.params.c")).to.be("c");
  });
});