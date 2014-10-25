var router = require(".."),
expect     = require("expect.js");

describe("exit#", function () {

  // deprecated
  return;

  it("can call exit on a route", function (next) {
    var i = 0, j = 0;
    var r = router().add({
      "/a": {
        exit: function (r, next) {
          i++;
          next();
        }
      },
      "/b": {
        enter: function (r, next) {

          // make sure exit is called before enter
          expect(i).to.be(1);
          j++;
          next();
        }
      }
    });

    r.redirect("/a", function () {
      expect(i).to.be(0);
      expect(j).to.be(0);
      r.redirect("/b", function () {
        expect(i).to.be(1);
        expect(j).to.be(1);
        next();
      })
    });
  });

  it("can call multiple exit functions", function (next) {

    var i = 0;

    var r = router().add({
      "/a": {
        exit: [function (r, next) {
          i++;
          next();
        }, function (r, next) {
          i++;
          next();
        }]
      },
      "/b": {}
    });

    r.redirect("/a", function () {
      expect(i).to.be(0);
      r.redirect("/b", function () {
        expect(i).to.be(2);
        next();
      })
    });
  });

  it("can call exit on a parent route", function (next) {
    var i = 0;
    var r = router().add({
      exit: function (r, next) {
        i++;
        next();
      },
      "/a": {
        exit: function (r, next) {
          i++;
          next();
        },
        routes: {
          "/b": {
            exit: function (r, next) { 
              i++;
              next();
            }
          }
        }
      },
      "/b": {}
    });

    r.redirect("/a/b", function () {
      expect(i).to.be(0);
      r.redirect("/b", function () {
        expect(i).to.be(3);
        r.redirect("/a/b", function () {
          expect(i).to.be(4);
          next();
        })
      });
    });
  })

});