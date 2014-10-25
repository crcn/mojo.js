var views = require("../views");

module.exports = function (app) {
  app.views.register({
    list   : views.List,
    states : views.States,
    stack  : views.Stack,
    base   : views.Base
  });
};
