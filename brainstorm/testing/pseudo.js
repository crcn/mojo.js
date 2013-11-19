var mojo = require("mojojs"),
views    = require("./views"),
models   = require("./models");



describe("login test#", function () {


  var app = new mojo.Application(), views = {};

  // load in the fake commands - these are the fixtures
  app.use(require("./unit/commands"));

  // the fake http router to use temporarily
  app.use(require("./unit/router"));

  // decorators used 
  app.use(require("./unit/decorators"));

  app.use(require("./models"));

  app.use(require("./views"));


  before(function () {

    // destroy the fake session
    app.mediator.execute("logout");
  });

  /**
   */

  it("navigates to the login page without a session", function () {
    var main = views.main = app.createView("main"), authView;
    expect(app.router.location).to.be("/login");
    main.render();
    expect(views.loginView = main.findSection("main.auth.login")).not.to.be(undefined);
  });

  /**
   */

  it("sends a 404", function (next) {
    views.loginView.set({ username: "u", password: "p" });
    views.loginView.login();
    expect(views.loginView.get("loading")).to.be(true);
    views.loginView.bind("error").once().to(function (err) {
      expect(err.message).to.contain("incorrect username");
      next();
    }).now();
  });

  /**
   */

  it("properly logs in", function (next) {
    views.loginView.set({ username: "user", password: "pass" });
    views.loginView.login();
    views.loginView.bind("success").once().to(function (err) {
      expect(app.router.location).to.be("/");
      next();
    }).now();
  });

  /**
   */

  it("can properly logout", function (next) {
    views.main.findSection("main.app").logout();
    expect(app.router.location).to.be("/login");
  });
});