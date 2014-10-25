var router = require(".."),
expect     = require("expect.js");

describe("basic#", function () {

  it("can create a router", function () {
    router();
  });

  it("can add routes", function() {
    var r = router().add({
      "/a": {},
      "/b": {},
      "/c": {}
    });

    expect(r.routes.all().length).to.be(3);
  });


  it("can add nested routes", function () {
    var r = router().add({
      "/a": {
        routes: {
          "/b": {},
          "/c": {},
          "/d": {
            routes: {
              "/e": {}
            }
          }
        }
      },
      "/b": {},
      "/c": {}
    });


    expect(r.routes.all().length).to.be(7);
  });

  it("properly sorts routes based on the path", function () {

    var r = router().add({
      "/a": {
        routes: {
          "/b": {},
          "/c": {},
          "/d": {
            routes: {
              "/e": {}
            }
          }
        }
      },
      "/b": {},
      "/c": {}
    });

    var order = [
      "/a/d/e",
      "/a/c",
      "/a/b",
      "/a/d",
      "/b",
      "/a",
      "/c"
    ];

    for (var i = order.length; i--;) {
      expect(r.routes.all()[i].pathname).to.be(order[i]);
    }
  });

  it("properly orders routes with params last", function () {

    /*var r = router().add({
      "/a": {
        routes: {
          "/:b": {},
          "/b": {}
        }
      },
      "/b": {},
      "/:b" :{}
    });


    var order = [
      "/a/:b",
      "/a/b",
      "/:b",
      "/b",
      "/a"
    ];


    for (var i = order.length; i--;) {
      expect(r.routes.all()[i].pathname).to.be(order[i]);
    }*/


    var r = router().add({
      "/a": {
        "/:b": {
          "/c": {
            "/d": {},
            "/:d": {}
          }
        },
        "/b": {
          "/:c": {
            "/:d": {},
            "/d": {}
          }
        }
      }
    });

    var order = [
      "/a",
      "/a/b",
      "/a/:b",
      "/a/b/:c",
      "/a/:b/c",
      "/a/b/:c/d",
      "/a/b/:c/:d",
      "/a/:b/c/d",
      "/a/:b/c/:d"
    ].reverse();

    for (var i = r.routes.all().length; i--;) {
      expect(r.routes.all()[i].pathname).to.be(order[i]);
    }
  });

  it("can setup a manual match and return false", function () {
    var r = router().add({
      "/a": {
        match: function (query) {
          return false;
        }
      },
      "/:b": {}
    });

    expect(r.routes.find({ pathname: "/a"}).pathname).to.be("/:b");
  });

   it("can setup a manual match and return true", function () {
    var r = router().add({
      "/a": {
        match: function (query) {
          return true;
        }
      }
    });

    expect(r.routes.find({ pathname: "/a"}).pathname).to.be("/a");
  });

  it("can perform an internal redirect when searching for a route", function () {
    var r = router().add({
      "/a": {
        match: function (query) {
          return { redirect: "/b" };
        }
      },
      "/b": {}
    });

    expect(r.routes.find({ pathname: "/a"}).pathname).to.be("/b");
  });

  it("performs a an internal if added params are different", function () {
    var r = router().add({
      "/a": {
        match: function (query) {
          if (query.params && query.params.get("b")) return { redirect: "/b" };
          return true;
        }
      },
      "/b": {}
    });

    var ar = r.routes.find({ pathname: "/a" });
    expect(ar.getPathname({ params: { b: "c" }})).to.be("/b");
  });

  it("fills in undefined params as undefined", function () {
    var r = router().add({
      "/a/:bcd": {
        match: function (query) {
          return true;
        }
      }
    });

    expect(r.routes.find({ pathname: "/a/b"}).getPathname({})).to.be("/a/undefined");
  });
});
