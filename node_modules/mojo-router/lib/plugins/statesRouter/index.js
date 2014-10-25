module.exports = function (app) {

  var d = {
      priority: "load",
      getOptions: function (view) {
        return view.route;
      },
      decorate: function (view, route) {
        var binding = view.bind("models.states." + route, { to: function (v) {
          view.set("currentName", v);
        }}).now();
        view.once("dispose", binding.dispose);
      }
  }

  if (app.views) {
    app.views.decorator(d);
  } else if(app.decorator) {
    app.decorator(d);
  }

}
