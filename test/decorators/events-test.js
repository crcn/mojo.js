var expect = require("expect.js"),
mojo       = require("../.."),
bindable   = require("bindable");

describe("deorators/events#", function () {


  var app = new mojo.Application();

  /**
   */


  it("capture a bubbled event", function (next) {

    var view = new mojo.View({
      events: {
        "test": function (event, v) {
          expect(v).to.be("v");
          next();
        }
      }
    }, app);

    view.__decorators = undefined;

    view.render();
    view.emit("test", "v");
  });

  /**
   */

  it("can call a ref to a view method", function (next) {

    var view = new mojo.View({
      events: {
        "test": "onTest"
      },
      onTest: function (event, v) {
        expect(v).to.be("v");
        next();
      }
    }, app);

    view.__decorators = undefined;

    view.render();
    view.emit("test", "v");
  });

  /**
   */

  it("can listen on a DOM element", function (next) {
    var view = new mojo.View({
      events: {
        "click .button": function() {
          next();
        }
      },
      _onRender: function() {
        mojo.View.prototype._onRender.call(this);
        this.section.append($("<div><a href='#' class='button'>button</a></div>")[0]);
      },
      click: function() {  
        this.$(".button").click();
      }
    }, app);
    view.__decorators = undefined;
    view.render();
    view.click();
  });

  /**
   */

  it("can listen to multiple elements", function () {
    var clicks = 0;
    var view = new mojo.View({
      events: {
        "click .button .button2": function() {
          clicks++;
        }
      },
      _onRender: function() {
        mojo.View.prototype._onRender.call(this);
        this.section.append($("<div><a href='#' class='button button2'>button</a></div>")[0]);
      },
      click: function() {  
        this.$(".button").click();
        this.$(".button2").click();
      }
    }, app);
    view.__decorators = undefined;
    view.render();
    view.click();
    expect(clicks).to.be(2);
  })

  /**
   */

  it("removes the events decorator once the view has been disposed", function () {
    var emitted = false;
    var view = new mojo.View({
      events: {
        "click .button": function() {
          emitted = true;
        }
      },
      _onRender: function() {
        mojo.View.prototype._onRender.call(this);
        this.section.append($("<div><a href='#' class='button'>button</a></div>")[0]);
      },
      click: function() {  
        this.$(".button").click();
      }
    }, app);
    view.__decorators = undefined;
    view.render();
    view.dispose();
    view.click();
    expect(emitted).to.be(false);
  })
});