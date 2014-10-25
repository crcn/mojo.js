module.exports = {
  priority: 999,
  test: function (route) {
    return !!route.parent;
  },
  decorate: function (route) {
    var p = route.parent;
    route.mediator.on("pre enter", function (message, next) {
      p.enter(message.data, next);
    });
    route.mediator.on("pre exit", function (message, next) {
      p.exit(message.data, next);
    });
  }
}
