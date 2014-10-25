var views         = require("./views"),
viewDecor         = require("./plugins/decor"),
defaultViews      = require("./plugins/defaultComponents"),
RegisteredClasses = require("mojo-registered-classes");

var mojoViews = module.exports = function (app) {
  app.views = new RegisteredClasses(app);

  if (!app.animate) {
    app.use(require("mojo-animator"));
  }

  app.use(defaultViews);
  app.use(viewDecor);
};

/**
 * for debugging
 */

var Application = module.exports.Application = require("mojo-application");

module.exports.Base        = views.Base;
module.exports.List        = views.List;
module.exports.Stack       = views.Stack;

var mainApplication = Application.main;
mainApplication.use(require("mojo-animator"));
mainApplication.use(mojoViews);

module.exports.mainApplication = mainApplication;


views.Base.defaultApplication = mainApplication;
