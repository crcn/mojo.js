var router = require(".."),
expect     = require("expect.js");

describe("enter#", function () {

  it("can call enter on a route", function (next) {
    var i = 0;
    var r = router().add({
      "/a": {
        enter: function (r, next) {
          i++;
          next();
        }
      }
    });

    r.redirect("/a", function () {
      expect(i).to.be(1);
      next();
    });
  });

  it("can call multiple enter functions", function (next) {
    var i = 0;
    var r = router().add({
      "/a": {
        enter: [function (r, next) {
          expect(i).to.be(0);
          i++;
          next();
        }, function (r, next) {
          expect(i).to.be(1);
          i++;
          next();
        }]
      }
    });

    r.redirect("/a", function () {
      expect(i).to.be(2);
      next();
    });
  })

  it("can call enter on a nested route", function (next) {
    var i = 0;
    var r = router().add({
      "/a": {
        routes: {
          "/b": {
            enter: function (r, next) {
              i++;
              next();
            }
          }
        }
      }
    });

    r.redirect("/a/b", function () {
      expect(i).to.be(1);
      next();
    });
  });

  it("can call enter on a parent route when entering a child route", function (next) {
    var i = 0;
    var r = router().add({
      enter: function (r, next) {
        i++;
        next();
      },
      "/a": {
        enter: function (r, next) {
          i++;
          next();
        },
        routes: {
          "/b": {
            enter: function (r, next) {
              i++;
              next();
            }
          }
        }
      }
    });

    r.redirect("/a/b", function () {
      expect(i).to.be(3);
      next();
    });
  });


  it("automatically calls next if the argument length is 1", function (next) {
    var i = 0;
    var r = router().add({
      "/a": {
        enter: function (r) {
          i++;
        }
      }
    });

    r.redirect("/a", function () {
      expect(i).to.be(1);
      next();
    });
  });

  it("automatically calls next if the argument length is 0", function (next) {
    var i = 0;
    var r = router().add({
      "/a": {
        enter: function () {
          i++;
        }
      }
    });

    r.redirect("/a", function () {
      expect(i).to.be(1);
      next();
    });
  });


});
