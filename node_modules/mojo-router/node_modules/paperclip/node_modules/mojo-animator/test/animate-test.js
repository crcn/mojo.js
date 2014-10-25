var expect  = require("expect.js"),
Application = require("mojo-application"),
animator    = require("..");

describe("animate#", function () {

  it("can be registed as a plugin", function () {
    var app = new Application();
    expect(app.animate).to.be(undefined);
    app.use(animator);
    expect(app.animate).not.to.be(undefined);
  });

  it("doesn't tick if process.browser is false", function () {
    var app = new Application();
    app.use(animator);
    var i = 0;
    app.animate({ update: function () {
      i++;
    }});
    expect(i).to.be(1);
  });

  it("ticks if process.browser is true", function () {
    var app = new Application();
    var i = 0;


    global.requestAnimationFrame = function (next) {
      i++;
      next();
    }

    app.use(animator);
    process.browser = 1;
    app.animate({
      update: function () {
      }
    })
    process.browser = 0;
    expect(i).to.be(1);

    delete global["requestAnimationFrame"];
  });

  it("runs animations proceduraly", function (next) {

      var app = new Application();
      var i = 0;

      global.requestAnimationFrame = function (next) {
        setTimeout(next, 0);
      }

      app.use(animator);
      process.browser = 1;
      app.animate({
        update: function () {
          i++;
          expect(i).to.be(1);
          app.animate({
            update: function () {
              i++;
              expect(i).to.be(2);
            }
          })
        }
      });

      app.animate({
        update: function () {
          i++;
          expect(i).to.be(3);
        }
      });


      setTimeout(function () {
        expect(i).to.be(3);
        next();
      }, 10);
  });


});
