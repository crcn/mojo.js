var bindable = require("bindable"),
async        = require("async"),
toarray      = require("toarray"),
mediocre     = require("mediocre");

function Route (pathname, options, routes, parent) {

  bindable.Object.call(this, this);

  this.pathname = pathname;
  this.parent   = parent;
  this.options  = options;
  this.routes   = routes;
  this.router   = routes.router;
  this.mediator = mediocre();
  this._setPathInfo();
}

bindable.Object.extend(Route, {

  /**
   */

  enter: function (request, next) {
    this.mediator.execute("enter", request, next);
  },

  /**
   */

  exit: function (request, next) {
    this.mediator.execute("exit", request, next);
  },

  /**
   */

  match: function (query) {
    if (query.pathname && !this._matchPath(query.pathname)) return false;
    return this._matchOption(query);
  },

  /**
   */

  getParams: function (reqPath) {

    var routePath = this.pathname;

    var reqPathParts = reqPath.split("/"),
    routePathParts   = routePath.split("/"),
    params = {};

    for (var i = routePathParts.length; i--;) {

      var part = routePathParts[i];

      if (part.substr(0, 1) === ":") {
        params[part.substr(1)] = reqPathParts[i];
      }
    }

    return params;
  },

  /**
   * DEPRECATED
   */

  getPathnameWithParams: function (params) {
    var pathname = this.pathname;

    for (var key in params) {
      pathname = pathname.replace(":" + key, params[key]);
    }

    pathname = pathname.replace(/\:[^\/]+/g, void 0);

    var redirectRoute = this.routes.find({ pathname: pathname, params: params });

    if (redirectRoute !== this) {
      return redirectRoute.getPathnameWithParams(params);
    }

    return pathname;
  },

  /**
   */

  getPathname: function (options) {

    var params = options.params || {},
    query      = options.query || {};

    if (!params.__isBindable) {
      params = new bindable.Object();
      params.setProperties(options.params || {});
    }

    if (!query.__isBindable) {
      query = new bindable.Object(query);
      query.setProperties(options.query || {});
    }

    var pathname = this.pathname,
    pcontext      = params;

    var paramParts = pathname.match(/\:[^\/]+/g) || [];

    for (var i = paramParts.length; i--;) {
      pathname = pathname.replace(paramParts[i], params.get(paramParts[i].substr(1)));
    }

    var redirectRoute = this.routes.find({ 
      pathname: pathname, 
      params: params, 
      query: query 
    });

    if (redirectRoute && redirectRoute !== this) {
      return redirectRoute.getPathname({ params: params, query: query });
    }

    return pathname;
  },

  /**
   */

  _matchPath: function (pathname) {
    return this._pathTester.test(pathname) || this.options.name === pathname;
  },

  /**
   */

  _matchOption: function (query) {
    return !this.options.match || this.options.match(query);
  },

  /**
   */

  _setPathInfo: function () {

    this.params = [];

    if (!this.pathname) return;

    this._pathTester = new RegExp("^" + this.pathname.replace(/\/\:[^\/]+/g, "/[^\/]+") + "$");

    var paramNames = this.pathname.match((/\/\:[^\/]+/g)) || [];


    for (var i = paramNames.length; i--;) {
      this.params.unshift(paramNames[i].substr(2));
    }
  }
});


module.exports = Route;
