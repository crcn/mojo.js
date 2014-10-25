var models  = require(".."),
Application = require("mojo-application"),
expect      = require("expect.js");

describe("model-virtuals#", function () {

  var app = new Application();
  app.use(models);

  it("can load a virtual property", function (next) {
    var Model = models.Base.extend({
      virtuals: {
        name: function (complete) {
          complete(null, "abba");
        }
      }
    });

    app.models.register("model", Model);
    app.models.create("model").bind("name", function (value) {
      expect(value).to.be("abba");
      next();
    }).now();
  });

  it("doesn't re-call a virtual property", function (next) {
    var i = 0;
    var Model = models.Base.extend({
      virtuals: {
        name: function (complete) {
          i++;
          complete(null, "abba");
        }
      }
    });

    app.models.register("model", Model);
    var model = app.models.create("model");

    model.bind("name", function (value) {
      model.bind("name", function (value) {
        expect(i).to.be(1);
        expect(value).to.be("abba");
        next();
      }).now();
    }).now();
  });

  it("passes the context of the model to the virtual function ", function () {
    var i = 0, model;
    var Model = models.Base.extend({
      virtuals: {
        name: function () {
          i++;
          expect(model).to.be(this);
        }
      }
    });

    app.models.register("model", Model);
    var model = app.models.create("model");
    model.bind("name", function(){}).now();
    expect(i).to.be(1);
  });

  it("doesn't re-fetch virtual if a property on a virtual doesn't exist", function () {
    var i = 0, model;
    var Model = models.Base.extend({
      virtuals: {
        city: function (next) {
          i++;
          next(null, {
            name: "San Francisco",
            zip: 94103
          })
        }
      }
    });

    app.models.register("model", Model);
    var model = app.models.create("model");
    model.bind("city.name", function(){}).now();
    model.bind("city.state", function(){}).now();
    expect(i).to.be(1);
  })

  it("recalls a virtual property if it doesn't exist", function (next) {
    var i = 0;
    var Model = models.Base.extend({
      virtuals: {
        name: function (complete) {
          i++;
          complete(null);
        }
      }
    });

    app.models.register("model", Model);
    var model = app.models.create("model");

    model.bind("name", function (value) {
      model.bind("name", function (value) {
        expect(i).to.be(2);
        next();
      }).now();
    }).now();
  });

  xit("calls load on a model if a property doesn't exist", function () {

    var i = 0;

    var Model = models.Base.extend({
      virtuals: {
      },
      load: function () {
        i++;
      }
    }); 


    app.models.register("model", Model);
    var model = app.models.create("model");

    model.bind("name", function (value) {
    }).now();
    expect(i).to.be(1);
  });

  xit("doesn't call load more than once", function () {
    var i = 0;

    var Model = models.Base.extend({
      virtuals: {
      },
      load: function () {
        i++;
      }
    }); 


    app.models.register("model", Model);
    var model = app.models.create("model");

    model.bind("name", function(){}).now();
    expect(i).to.be(1);
    model.bind("name", function(){}).now();
    expect(i).to.be(1);
  });

  xit("calls load if a property still doesn't exist", function () {
    var i = 0;

    var Model = models.Base.extend({
      virtuals: {
      },
      load: function (complete) {
        i++;
        complete(new Error("fail"));
      }
    }); 


    app.models.register("model", Model);
    var model = app.models.create("model");
    model.bind("name", function(){}).now();
    expect(i).to.be(1);
    model.bind("name", function(){}).now();
    expect(i).to.be(2);
  });

  it("doesn't call load on a model if it doesn't exist", function () {
    var Model = models.Base.extend({
      virtuals: {
      }
    }); 


    app.models.register("model", Model);
    var model = app.models.create("model");
    model.bind("name", function(){}).now();
  });


  it("calls virtual property * if no properties are found", function () {

    var i = 0;
    var Model = models.Base.extend({
      virtuals: {
        "*": function (property, next) {
          expect(property).to.be("notFound");
          expect(model).to.be(this);
          i++;
          next();
        }
      }
    });

    var model = new Model(void 0, app);
    model.bind("notFound", function(){}).now();
    expect(i).to.be(1);
  });



});