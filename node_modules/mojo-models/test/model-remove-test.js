var models  = require(".."),
Application = require("mojo-application"),
expect      = require("expect.js");

describe("model-remove#", function () {

  var app = new Application();
  app.use(models);

  it("can call remove on a model", function () {
    var Model = models.Base.extend({
      persist: {
        remove: function () {
        }
      }
    });

    var m = new Model({}, app);
    m.remove();
  });

  it("returns an error if a model can't be removed", function (next) {
    var Model = models.Base.extend({
      persist: {
        load: function () {
        }
      }
    });

    var m = new Model({data:{}}, app);
    m.remove(function (err) {
      expect(err.message).to.be("cannot remove model");
      next();
    });
  });

  it("can properly call .del() on a model", function (next) {
    var Model = models.Base.extend({
      persist: {
        remove: function (complete) {
          next();
        }
      }
    });

    var m = new Model({data:1}, app);
    m.remove();
  });

  it("returns reference of model removed on remove", function (next) {
    var Model = models.Base.extend({
      persist: {
        remove: function (complete) {
          complete();
        }
      }
    });

    var m = new Model({data:1}, app);
    m.remove(function (err, m2) {
      expect(m).to.be(m2);
      next();
    });
  });
  it("emits 'willRemove' before running save", function (next) {
    var Model = models.Base.extend({
      persist: {
        remove: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:{}}, app);
    m.once("willRemove", next);
    m.remove();
  });

  it("emits 'didRemove' after a model is removed", function (next) {
    var Model = models.Base.extend({
      persist: {
        remove: function (complete) {
          complete();
        }
      }
    });

    var m = new Model({data:1}, app);
    m.once("didRemove", next);
    m.remove();
  });

  it("can remove if the callback is an object", function () {
    var Model = models.Base.extend({
      persist: {
        remove: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:{}}, app);
    m.remove({});
  });

  it("emits 'dispose' after a model is removed", function (next) {
    var Model = models.Base.extend({
      persist: {
        remove: function (complete) {
          complete();
        }
      }
    });

    var m = new Model({data:1}, app);
    m.once("dispose", next);
    m.remove();
  });
});