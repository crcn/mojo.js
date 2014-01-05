var views   = require("./views"),
Application = require("./application"),
pools       = require("./pools");

module.exports = {
  View: views.BaseView,
  Application: Application,
  pool: pools.add
};

if (typeof window !== "undefined") {
  window.mojo = module.exports;
}