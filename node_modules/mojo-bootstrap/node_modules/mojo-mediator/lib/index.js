var mediocre = require("mediocre");

module.exports = function (app) {
  if (app.mediator) return;
  var mediator = app.mediator = mediocre()
  mediator.application = app
}