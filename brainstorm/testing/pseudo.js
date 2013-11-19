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
    main.render();
    expect(views.loginView = main.findSection("main.auth.login")).not.to.be(undefined);
  });

  /**
   */

  it("sends a 404", function (next) {
    views.loginView.set({ username: "u", password: "p" });
    views.loginView.login();
    views.loginView.bind("error").once().to(function(err) {
      expect(err.message).to.contain("incorrect username");
      next();
    }).now();
  });

});