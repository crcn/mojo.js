var Animator = require("./animator");

module.exports = function (app) {
  var animator = new Animator();
  app.animate = function (animatable) {
    animator.animate(animatable);
  };
}
