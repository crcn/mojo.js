var views = require("../.."),
expect    = require("expect.js");

var jsdom  = require("jsdom"),
nofactor   = require("nofactor"),
fs         = require("fs"),
Application = require("mojo-application");



describe("decorators/events#", function () {

  var app;

  before(function (next) {
    jsdom.env("<html><head></head><body></body></html>", [ __dirname + "/jquery.js"], function(err, window) {

      // trigger for some libs
      global.window = window;

      // set the document to global so that nofactor has access to it
      global.document = window.document;

      // make sure this is accessible in the application
      global.$ = window.$;

      next();

      app = new Application({ nodeFactory: nofactor.dom });
      app.use(views);
    });
  });

  it("can capture an event", function () {
    var i = 0;
    var v = new views.Base().decorate({
      events: {
        event: function (event, v) {
          i++;
          expect(v).to.be("a");
        }
      }
    })
    v.render();
    v.emit("event", "a");
    expect(i).to.be(1);
  });

  it("can call a method on a vew controller", function () {
    var i = 0;
    var v = new views.Base({
      onEvent: function () {
        i++;
      }
    }).decorate({
      events: {
        event: "onEvent"
      }
    })
    v.render();
    v.emit("event");
    expect(i).to.be(1);
  });

  // TODO  - shouldn't touch events
  it("lowercases events", function () {
    var emits = 0;
    var v = new views.Base({
    }, app).decorate({
      events: {
        "camelEvent": function () {
          emits++;
        }
      }
    });

    v.render();
    v.emit("camelEvent");
    v.emit("camelevent");
    expect(emits).to.be(1);
  });

  it("can listen on a element for an event", function () {
    var i = 0;
    var v = new views.Base({
      willRender: function () {
        this.section.append($("<div><a href='#' class='button'>button</a></div>")[0]);
      },
      click: function () {
        this.$(".button").click();
      }
    }, app).decorate({
      events: {
        "click .button": function() {
          i++;
        }
      }
    })

    v.render();
    v.click();
    expect(i).to.be(1);
  });


  /**
   */

  it("can listen to multiple elements for events", function () {
    var clicks = 0;
    var v = new views.Base({
      willRender: function() {
        this.section.append($("<div><a href='#' class='button button2'>button</a></div>")[0]);
      },
      click: function() {  
        this.$(".button").click();
        this.$(".button2").click();
        this.emit("camelEvent")
      }
    }, app).decorate({
      events: {
        "click .button .button2": function() {
          clicks++;
        },
        "camelEvent": function () {
          clicks++;
        }
      }
    });
    
    v.render();
    v.click();
    expect(clicks).to.be(3);
  });

  it("removes the events decorator once the view has been disposed", function () {
    var emitted = false;
    var v = new views.Base({
      willRender: function () {
        this.section.append($("<div><a href='#' class='button'>button</a></div>")[0]);
      },
      click: function() {  
        this.$(".button").click();
        this.emit("camelevent");
      }
    }, app).decorate({
      events: {
        "click .button": function() {
          emitted = true;
        },
        "camelEvent": function () {
          emitted = true;
        }
      }
    });

    v.render();
    v.dispose();
    v.click();
    expect(emitted).to.be(false);
  });



  
});