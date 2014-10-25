var expect = require("expect.js"),
Application = require("mojo-application"),
views       = require("mojo-views"),
router      = require(".."),
async       = require("async"),
bootstrap   = require("mojo-bootstrap"),
paperclip   = require("paperclip");


async.setImmediate = async.nextTick = function (next) {
  next();
}

describe("datahref#", function () {

  var app;

  beforeEach(function () {
    app = new Application();
    app.use(router);
    app.use(views);
    app.use(require("mojo-paperclip"));
    app.initialize();
  })

  it("properly assigns the correct link with data-href", function () {

    app.router.add({
      "/home": {
        name: "home"
      }
    });

    var view = new views.Base({
      paper: paperclip.compile("<a data-href='home'>home</a>")
    }, app);

    view.render();

    expect(view.render().toString()).to.be('<a data-href="home" href="/home">home</a>');
  });

  it("properly fills in a route, even with undefined values", function () {

    app.router.add({
      "/hello/:name/:last": {
        name: "home"
      }
    });

    var view = new views.Base({
      name: "craig",
      paper: paperclip.compile("<a data-href='home'>home</a>")
    }, app);

    view.render();

    expect(view.render().toString()).to.be('<a data-href="home" href="/hello/craig/undefined">home</a>');
  });

  it("properly fills in routes with dot-syntax", function () {

    app.router.add({
      "/hello/:name.first/:name.last": {
        name: "home"
      }
    });

    var view = new views.Base({
      name: {
        first: "a",
        last: "b"
      },
      paper: paperclip.compile("<a data-href='home'>home</a>")
    }, app);

    view.render();

    expect(view.render().toString()).to.be('<a data-href="home" href="/hello/a/b">home</a>');
  });

  it("changes the link as properties change on the view", function () {


    app.router.add({
      "/hello/:name.first/:name.last": {
        name: "home"
      }
    });

    var view = new views.Base({
      name: {
        first: "a",
        last: "b"
      },
      paper: paperclip.compile("<a data-href='home'>home</a>")
    }, app);

    view.render();

    expect(view.render().toString()).to.be('<a data-href="home" href="/hello/a/b">home</a>');
    view.set("name.first", "c");
    expect(view.render().toString()).to.be('<a data-href="home" href="/hello/c/b">home</a>');

  });

  it("pulls params from the location if they don't exist as properties on the view controller", function () {

    app.router.add({
      "/hello/:name": {
        name: "home"
      }
    });

    app.router.redirect("/hello/a");

    var view = new views.Base({
      paper: paperclip.compile("<a data-href='home'>home</a>")
    }, app);

    view.render();

    expect(view.render().toString()).to.be('<a data-href="home" href="/hello/a">home</a>');
    app.router.redirect("/hello/c");
    expect(view.render().toString()).to.be('<a data-href="home" href="/hello/c">home</a>');
    view.set("name", "d");
    expect(view.render().toString()).to.be('<a data-href="home" href="/hello/d">home</a>');
  });

  it("can internally redirect anchor links of the location matches a certain case", function () {

    app.router.add({
      "/:lang/home": {
        name: "home",
        match: function (query) {
          if (query.params && query.params.get("lang") === "en-US") return { redirect: "/home" }
          return true;
        }
      },
      "/home": {
        name: "home2"
      }
    });

    app.router.redirect("/es-MX/home");

    var view = new views.Base({
      paper: paperclip.compile("<a data-href='home'>home</a>")
    }, app);

    view.render();

    expect(view.render().toString()).to.be('<a data-href="home" href="/es-MX/home">home</a>');

    app.router.redirect("/en-US/home");
    expect(view.render().toString()).to.be('<a data-href="home" href="/home">home</a>');
  });
});