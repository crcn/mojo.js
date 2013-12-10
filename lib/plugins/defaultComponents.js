var views = require("../views");

module.exports = function (app) {
  app.registerViewClass("list", views.ListView);
  app.registerViewClass("states", views.StatesView);
  app.registerViewClass("base", views.BaseView);
};
