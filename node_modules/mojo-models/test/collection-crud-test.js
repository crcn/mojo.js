var models  = require(".."),
expect      = require("expect.js"),
Application = require("mojo-application");

describe("collection-crud#", function () {

  var app = new Application();
  app.use(models);

  describe("load", function () {
    it("can can call load on a collection", function (next) {

      var Collection = models.Collection.extend({
        persist: {
          read: function (complete) {
            complete();
          }
        }
      })
      var c = new Collection(null, app);

      c.load(function () {
        next();
      })
    });
  });


});