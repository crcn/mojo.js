var models  = require(".."),
Application = require("mojo-application"),
expect      = require("expect.js");

describe("model-load#", function () {

  var app = new Application();
  app.use(models);

  it("can call load on a model", function () {
    var Model = models.Base.extend({
      persist: {
        load: function(){}
      }
    });

    var m = new Model({}, app);
    m.load();
  });

  it("returns an error if a model id .load() isn't defined in persist", function (next) {
    var Model = models.Base.extend({
      persist: {
        update: function(){}
      }
    });

    var m = new Model({}, app);
    m.load(function (err) {
      expect(err.message).to.be("cannot load model");
      next();
    });
  });


  it("properly sets the data from .load() on the model", function (next) {

    var Model = models.Base.extend({
      persist: {
        load: function (complete) {
          complete(null, { name: "a" });
        }
      }
    });

    var m = new Model({ _id: "abba" }, app);
    m.load(function () {
      expect(m.get("name")).to.be("a");
      expect(m.get("data.name")).to.be("a");
      next();
    });
  });

  it("deserializes data once it's been loaded", function (next) {
    var Model = models.Base.extend({
      persist: {
        load: function (complete) {
          complete(null, { name: "a" });
        },
      },
      deserialize: function (data) {
        return {
          name: data.name.toUpperCase()
        }
      }
    });

    var m = new Model({_id:"abba"}, app);
    m.load(function () {
      expect(m.get("name")).to.be("A");
      expect(m.get("data.name")).to.be("a");
      next();
    });
  });

  it("can load if the callback is an object", function () {
    var Model = models.Base.extend({
      persist: {
        load: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:{}}, app);
    m.load({});
  });

  it("can return an error", function (next) {
    var Model = models.Base.extend({
      persist: {
        load: function (complete) {
          complete(new Error("abba"));
        }
      }
    });

    var m = new Model({_id:"abba"}, app);
    m.load(function (err) {
      expect(err.message).to.be("abba");
      next();
    });
  });

  it("can reload a model that hasn't loaded properly", function (next) {
    var i = 0;
    var Model = models.Base.extend({
      persist: {
        load: function (complete) {
          i++;
          complete(new Error("abba"));
        }
      }
    });

    var m = new Model({_id:"abba"}, app);
    m.load(function (err) {
      expect(i).to.be(1);
      process.nextTick(function () {
        m.load(function () {
          expect(i).to.be(2);
          next();
        })
      })
    });
  });

  it("can reload without a callback", function () {
    var i = 0;
    var Model = models.Base.extend({
      persist: {
        load: function (complete) {
          i++;
          complete();
        }
      }
    });

    var m = new Model({_id:"abba"}, app);
    m.load();
    m.reload();
  });

  it("returns model on load", function (next) {
    var Model = models.Base.extend({
      persist: {
        load: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({_id:"abba"}, app);
    m.load(function (err, m2) {
      expect(m).to.be(m2);
      next();
    });
  });

});
