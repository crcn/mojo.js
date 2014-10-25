var router = require("../"),
expect     = require("expect.js");

describe("states#", function () {

  it("sets states on redirect", function (next) {
    var r = router().add({
      "/a": {
        states: {
          a: "b",
          b: "3"
        }
      }
    });

    r.redirect("/a", function (err, location) {
      expect(location.get("states.a")).to.be("b");
      // expect(r.get("application.models.states.a")).to.be("b");
      next();
    });
  });

  it("can inherit states from parent routes", function (next) {
    var r = router().add({
      "/a": {
        states: {
          "/": "/a"
        },
        routes: {
          "/b": {
            states: {
              "/a": "/a/b"
            }
          }
        }
      },
      "/b": {
        states: {
          "/": "/b"
        }
      }
    });

    r.redirect("/a/b", function (err, location) {
      expect(location.get("states./")).to.be("/a");
      expect(location.get("states./a")).to.be("/a/b");
      // expect(r.get("application.models.states./")).to.be("/a");
      // expect(r.get("application.models.states./a")).to.be("/a/b");
      next();
    })
  });
});