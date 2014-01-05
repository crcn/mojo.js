var views   = require("./views"),
Application = require("./application"),
decor       = require("./plugins/decor"),
pool        = require("./utils/pool");


decor.decorator(require("mojo-paperclip"));

module.exports = {
  View: views.BaseView,
  Application: Application,
  decorator: decor.decorator,
  pool: pool
};

if (typeof window !== "undefined") {
  window.mojo = module.exports;
}