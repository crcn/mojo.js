module.exports = function (app) {
  app.mediator.on("pre bootstrap", function (message, next) {
    $(document).ready(function () {
      next();
    });
  });
}