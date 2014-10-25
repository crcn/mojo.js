var bindable = require("bindable"),
_            = require("underscore"),
qs           = require("querystring"),
outcome      = require("outcome"),
comerr       = require("comerr");

function Location (router, options) {
  bindable.Object.call(this, this);

  if (!options) options = {};

  this.pathname = options.pathname;
  this.options = options;
  this.query  = new bindable.Object();
  this.query.setProperties(options.query || {});
  this.params = new bindable.Object();
  this.params.setProperties(options.params || {});
  this.route  = options.route;
  this.router = router;


  this._rebuildUrl = _.bind(this._rebuildUrl, this);

  this.query.on("change", this._rebuildUrl);
  this.params.on("change", this._rebuildUrl);
  this.on("change", this._rebuildUrl);
  this._rebuildUrl();
}

bindable.Object.extend(Location, {

  /**
   */

  equals: function (location) {
    return this.pathname == location.pathname;
  },


  /**
   */

  merge: function (request) {

    this.setProperties({ 
      route    : request.route,
      params   : request.params
    });

    this.mergeQuery(request.query.toJSON());
    return this;
  },

  /**
   */

  enter: function (next) {

    
    if (!this.route) {
      return next(comerr.notFound("path " + this.pathname + "not found"));
    }

    var self = this;

    self.once("complete", next);


    // new path? re-renter
    this.route.enter(this, outcome.e(next).s(function () {
      self.emit("complete", void 0, {});
    }));
  },

  /**
   */

  redirect: function (path, options, next) {

    if (typeof options === "function") {
      next = options;
      options = {};
    }

    if (!next) next = function () {};


    this.emit("complete", void 0, {
      redirect: /^http/.test(path) ? path : this.router.routes.getPathnameWithParams(path, options || {})
    });

    
  },

  /**
   */

  mergeQuery: function (q) {
    for (var property in q) {
      // if (this.query.has(property)) continue;
      this.query.set(property, q[property]);
    }
  },

  /**
   */

  _rebuildUrl: function () {

    var url = this.get("pathname");

    if (Object.keys(this.query.toJSON()).length) {
      url += "?" + qs.stringify(this.query.toJSON());
    }

    this.set("url", url);
  }
});


module.exports = Location;
