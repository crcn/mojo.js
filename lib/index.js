var views   = require("./views"),
Application = require("./application"),
pool        = require("./utils/pool");

module.exports = {
  View: views.BaseView,
  Application: Application,
  pool: pool
};

if (typeof window !== "undefined") {
  window.mojo = module.exports;
}