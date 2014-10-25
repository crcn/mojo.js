var router = require(".."),
expect     = require("expect.js");

describe("redirect#", function () {

  it("can redirect to a route", function (next) {
    var r = router().add({
      "/a": {},
      "/b": {},
      "/c": {}
    });

    r.redirect("/a", function (err, location) {
      expect(location.get("route.pathname")).to.be("/a");
      r.redirect("/b", function (err, location) {
        expect(location.get("route.pathname")).to.be("/b");
        r.redirect("/c", function (err, location) {
          expect(location.get("route.pathname")).to.be("/c");
          next();
        });
      });
    });
  });

  it("returns a 404 error if a route doesn't exist", function (next) {
    var r = router().add({ "/a": {} })
    r.redirect("/b", function (err) {
      expect(err.code).to.be("404");
      next();
    });
  });

  it("emits a 404 error of a route doesn't exist", function (next) {
    var r = router();
    r.on("error", function (err) {
      expect(err.code).to.be("404");
      next();
    })
    r.redirect("/a");
  });

  it("stays on the previous location if the new one is not found", function (next) {
    var r = router().add({
      "/a": {}
    });

    r.redirect("/a", function () {
      expect(r.get("location.pathname")).to.be("/a");
      r.redirect("/b", function (err) {
        expect(err.code).to.be("404");
        expect(r.get("location.pathname")).to.be("/a");
        next()
      })
    })
  });

  it("doesn't set the location until after redirecting", function (next) {
    var r = router().add({
      "/a": {
        enter: function (location, next) {
          setTimeout(next, 1);
        }
      }
    });
    r.redirect("/a", function () {
      expect(r.get("location")).not.to.be(void 0);
      next();
    });
    expect(r.get("location")).to.be(void 0);
  });

  it("can redirect to nested routes", function (next) {
    var r = router().add({
      "/a": {
        routes: {
          "/b": {}
        }
      }
    });

    r.redirect("/a/b", function (err, location) {
      expect(location.get("route.pathname")).to.be("/a/b");
      next();
    });
  });

  it("can redirect to nested routes with params", function (next) {
    var r = router().add({
      "/a": {
        routes: {
          "/:b": {},
          "/c": {}
        }
      }
    });

    r.redirect("/a/b", function (err, location) {
      expect(location.get("route.pathname")).to.be("/a/:b");
      expect(location.get("pathname")).to.be("/a/b");
      r.redirect("/a/c", function (err, location) {
        expect(location.get("route.pathname")).to.be("/a/c");
        expect(location.get("pathname")).to.be("/a/c");
        next();
      });
    });
  });


  it("doesn't hit the original route on redirect", function (next) {

    var i = 0;

    var r = router().add({
      "/a": {
        enter: [function (location, next) {
          location.redirect("/b", next);
        }, function (next) {
          i++;
        }]
      },
      "/b": {
        enter: function (location, next) {
          i++;
          next();
        }
      }
    });

    r.redirect("/a", function (err, location) {
      expect(i).to.be(1);
      next();
    });
  });


  it("merges queries from the previous request", function (next) {
    var r = router().add({
      "/a": {
        routes: {
          "/:b": {},
          "/c": {}
        }
      }
    });

    r.redirect("/a/b?name=blah", function (err, location) {
      r.redirect("/a/c?last=halb", function (err, location) {
        expect(location.query.get("name")).to.be("blah");
        expect(location.query.get("last")).to.be("halb");
        next();
      });
    })
  })

  it("can't redirect to the same location", function (next) {

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

    r.redirect("/a/b", function (err, location) {
      r.redirect("/a/b", function (err, location) {
        expect(i).to.be(1);
        next();
      });
    });
  });

  it("can redirect to the same route if a param is different", function (next) {

    var i = 0;

    var r = router().add({
      "/a": {
        routes: {
          "/:b": {
            enter: function (r, next) {
              i++;
              next();
            }
          }
        }
      }
    });

    r.redirect("/a/b", function (err, location) {
      r.redirect("/a/c", function (err, location) {
        expect(i).to.be(2);
        next();
      });
    });
  });

  it("can pass query params to the redirect script", function (next) {

    var i = 0;

    var r = router().add({
      "/a": {}
    });

    r.redirect("/a?b=c", function (err, location) {
      expect(location.get("query.b")).to.be("c");
      expect(location.get("url")).to.be("/a?b=c");
      // expect(r.get("application.models.query.b")).to.be("c");
      next();
    });
  });

  it("updates the query object on the current location if the pathname doesn't change", function (next) {

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

    r.redirect("/a/b?c=d", function (err, location) {
      expect(location.get("query.c")).to.be("d");
      expect(location.get("url")).to.be("/a/b?c=d");
      r.redirect("/a/b?c=e", function (err, location) {
        expect(location.get("query.c")).to.be("e");
        expect(location.get("url")).to.be("/a/b?c=e");
        expect(i).to.be(1);
        next();
      });
    });
  });

  it("can redirect based on the route name", function (next) {

    var r = router().add({
      "/a": {
        name: "aRoute"
      }
    });

    r.redirect("aRoute", function (err, location) {
      expect(location.get("pathname")).to.be("/a");
      expect(location.get("route.pathname")).to.be("/a");
      next();
    });
  });

  it("can redirect to a route name with params", function (next) {

    var r = router().add({
      "/:a": {
        routes: {
          "/:b": {
            name: ":a:bRoute"
          }
        }
      }
    });

    r.redirect(":a:bRoute", {
      params: {
        a: "1",
        b: "2"
      }
    }, function (err, location) {
      expect(location.get("pathname")).to.be("/1/2");
      expect(location.get("route.pathname")).to.be("/:a/:b");
      // expect(r.get("application.models.params.a")).to.be("1");
      next();
    });
  });

  it("can redirect with query params", function (next) {
    var r = router().add({
      "/a": {
        redirect: "/b?c=d"
      },
      "/b": {

      }
    });

    r.redirect("/a", function () {
      expect(r.get("location.url")).to.be("/b?c=d");
      next();
    })
  });

  it("can redirect to a route name twice with different params", function (next) {
    var r = router().add({
      "/:a": {
        routes: {
          "/:b": {
            name: ":a:bRoute"
          }
        }
      }
    });

    r.redirect(":a:bRoute", {
      params: {
        a: "1",
        b: "2"
      }
    }, function (err, location) {
      expect(location.get("pathname")).to.be("/1/2");
      expect(location.get("route.pathname")).to.be("/:a/:b");

      r.redirect(":a:bRoute", {
        params: {
          a: "3",
          b: "4"
        }
      }, function (err, location) {
        expect(location.get("pathname")).to.be("/3/4");
        expect(location.get("route.pathname")).to.be("/:a/:b");
        expect(location.get("url")).to.be("/3/4")
        next();
      });
    });
  });

  it("can redirect to a route name with query params", function (next) {

    var r = router().add({
      "/a": {
        name: "aRoute"
      }
    });

    r.redirect("aRoute", {
      query: {
        a: "b"
      }
    }, function (err, location) {
      expect(location.get("pathname")).to.be("/a");
      expect(location.get("query.a")).to.be("b");
      expect(location.get("url")).to.be("/a?a=b")
      next();
    })
  });

  it("redirects if the first param in next() has a redirect property", function (next) {

    var r = router().add({
      "/a": {
        enter: function (r, next) {
          r.redirect("/b", next);
        }
      },
      "/b": {}
    });

    r.redirect("/a", function (err, location) {
      expect(location.get("pathname")).to.be("/b");
      next();
    });
  });

  it("can redirect properly if there are multiple redirects", function (next) {
    var r = router().add({
      "/a": {
        enter: function (r, next) {
          r.redirect("/b", next);
        }
      },
      "/b": {}
    });

    r.redirect("/a", function (err, location) {
      r.redirect("/a", function (err, location) {
        expect(location.get("pathname")).to.be("/b");
        next();
      });
    });
  });

  it("redirects if a redirect property is present", function (next) {

    var r = router().add({
      "/a": {
        redirect: "/b"
      },
      "/b": {}
    });

    r.redirect("/a", function (err, location) {
      expect(location.get("pathname")).to.be("/b");
      next();
    });
  });

});
