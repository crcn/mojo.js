var router = require(".."),
expect     = require("expect.js");

describe("find-route#", function () {

  it("can find a basic route", function () {

    var r = router().add({
      "/a": {},
      "/b": {},
      "/c": {}
    });

    expect(r.routes.find({ pathname: "/a" }).pathname).to.be("/a");
    expect(r.routes.find({ pathname: "/b" }).pathname).to.be("/b");
    expect(r.routes.find({ pathname: "/c" }).pathname).to.be("/c");
  });


  it("returns undefined if a route is not found", function () {

    var r = router().add({
      "/a": {}
    });

    expect(r.routes.find({ pathname: "baab" })).to.be(undefined);
  });

  it("can find nested routes", function () {

    var r = router().add({
      "/a": {
        routes: {
          "/b": {},
          "/c": {
            routes: {
              "/d": {}
            }
          }
        }
      },
      "/b": {},
      "/c": {}
    });

    expect(r.routes.find({ pathname: "/a" }).pathname).to.be("/a");
    expect(r.routes.find({ pathname: "/a/b" }).pathname).to.be("/a/b");
    expect(r.routes.find({ pathname: "/a/c" }).pathname).to.be("/a/c");
    expect(r.routes.find({ pathname: "/a/c/d" }).pathname).to.be("/a/c/d");
  });

  it("can find routes with params", function () {


    var r = router().add({
      "/a": {
        routes: {
          "/:b": {},
          "/c": {
            routes: {
              "/d": {}
            }
          }
        }
      },
      "/:b": {},
      "/c": {}
    });

    // make sure params don't override existing routes too
    expect(r.routes.find({ pathname: "/a" }).pathname).to.be("/a");
    expect(r.routes.find({ pathname: "/b" }).pathname).to.be("/:b");
    expect(r.routes.find({ pathname: "/c" }).pathname).to.be("/c");
    expect(r.routes.find({ pathname: "/a/b" }).pathname).to.be("/a/:b");
    expect(r.routes.find({ pathname: "/a/a-b" }).pathname).to.be("/a/:b");
    expect(r.routes.find({ pathname: "/a/c" }).pathname).to.be("/a/c");
    expect(r.routes.find({ pathname: "/a/c/d" }).pathname).to.be("/a/c/d");
  });

  it("can find routes based on the name", function () {

    var r = router().add({
      "/a": {
        name: "aRoute",
        routes: {
          "/:b": {
            name: "a:bRoute"
          },
          "/c": {
            name: "acRoute"
          }
        }
      },
      "/:b": {
        name: ":bRoute"
      }
    });


    expect(r.routes.find({ pathname: "aRoute" }).pathname).to.be("/a");
    expect(r.routes.find({ pathname: "a:bRoute" }).pathname).to.be("/a/:b");
    expect(r.routes.find({ pathname: "acRoute" }).pathname).to.be("/a/c");
    expect(r.routes.find({ pathname: ":bRoute" }).pathname).to.be("/:b");
  });

});