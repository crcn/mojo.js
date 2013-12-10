var views   = require("./views"),
Application = require("./application");

module.exports = {
  View: views.BaseView,
  Application: Application
};

if (typeof window !== "undefined") {
  window.mojo = module.exports;
}