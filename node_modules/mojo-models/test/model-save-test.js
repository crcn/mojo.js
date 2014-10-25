var models  = require(".."),
Application = require("mojo-application"),
expect      = require("expect.js");

describe("model-save#", function () {

  var app = new Application();
  app.use(models);

  it("can call save on a model when update is defined", function () {
    var Model = models.Base.extend({
      persist: {
        update: function () {
        }
      }
    });

    var m = new Model({}, app);
    m.save();
  });

  it("can call save on a model when create is defined", function () {
    var Model = models.Base.extend({
      persist: {
        create: function () {
        }
      }
    });

    var m = new Model({}, app);
    m.save();
  });




  it("calls .save() when data is defined", function (next) {
    var Model = models.Base.extend({
      persist: {
        save: function () {
          next();
        }
      }
    });

    var m = new Model({ data: {} }, app);
    m.save();
  });

  it("sets data when .save() calls successfuly", function (next) {
    var Model = models.Base.extend({
      persist: {
        save: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model(null, app);
    m.save(function () {
      expect(m.name).to.be("abba");
      next();
    });
  });

  it("doesn't set data if not in second arg", function (next) {
    var Model = models.Base.extend({
      persist: {
        save: function (complete) {
          complete(null);
        }
      }
    });

    var m = new Model({ name: "abba" }, app);
    m.save(function () {
      expect(m.name).to.be("abba");
      next();
    });
  });

  it("emits 'willSave' before running save", function (next) {
    var Model = models.Base.extend({
      persist: {
        save: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:{}}, app);
    m.once("willSave", next);
    m.save();
  });


  it("emits 'didSave' after running save", function (next) {
    var Model = models.Base.extend({
      persist: {
        save: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:{}}, app);
    m.once("didSave", next);
    m.save();
  });



  it("can save if the callback is an object", function () {
    var Model = models.Base.extend({
      persist: {
        save: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:{}}, app);
    m.save({});
  });


  it("returns model on save", function (next) {
    var Model = models.Base.extend({
      persist: {
        save: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:null}, app);
    m.save(function (err, m2) {
      expect(m).to.be(m2);
      next();
    });
  });
});