var crowbar = require("crowbar");

module.exports = function (app) {

  if (!app.mediator) app.use(require("mojo-mediator"));
  if (app.paperclip) app.paperclip.nodeBinding("data-href", require("./plugins/datahref"));
  app.use(require("./plugins/statesRouter"));

  var r = app.router = crowbar({});

  r.bind("location"        , { target: app, to: "location"      });
  r.bind("location.query"  , { target: app, to: "models.query"  });
  r.bind("location.params" , { target: app, to: "models.params" });
  r.bind("location.states" , { target: app, to: "models.states" });

  // want to load on pre bootstrap to beat anything such as i18n loading, and
  // initializing views

  // UPDATE - want to make sure that check session is initialized before this (CC)
  app.mediator.on("post bootstrap", function (message, next) {

    if (process.browser && message.data.useHistory !== false) {
      r.use(crowbar.listeners.http);
    }

    r.init();

    next();
  });


  // express plugin
  r.middleware = function (options) {

    if (!options) options = {};
    if (!options.mainViewName) options.mainViewName = "main";

    var cachedViews = {},
    getProps        = options.getProps || function (request) {
      return {};
    }

    return function (req, res, next) {
      var request = r.request(req.url);
      request.request = req;
      request.enter(function (err, ret) {

        if (err) {
          if (err.code == "404") return next();
          return next();
        }

        if (ret.redirect) {
          return res.redirect(ret.redirect);
        }

        var viewName = request.route.options.view || options.mainViewName,
        view;

        if (app.debug || !(view = cachedViews[viewName])) {
          view = cachedViews[viewName] = app.views.create(viewName);
          view.render();
        }

        var props = getProps(request);
        props.states = request.get("states");

        view.setProperties(props);

        var html = view.section.toString();

        res.send(html);

        if (app.debug) view.dispose(); // cleanup - need to remove all bindings here.

      })
    }
  }

  return r;
};
