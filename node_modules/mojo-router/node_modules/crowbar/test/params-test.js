var router = require(".."),
expect     = require("expect.js");

describe("params#", function () {

  // TODO - r.param("name")

  it("can define a param", function (next) {
    var r = router(), i = 0;
    r.param("b", function (request, next) {
      expect(request.get("params.b")).to.be("b");
      i++;
      next();
    }); 

    r.add({
      "/a": {
        routes: {
          "/:b": {}
        }
      }
    });

    r.redirect("/a/b", function (err, location) {
      expect(location.get("params.b")).to.be("b");
      expect(i).to.be(1);
      next();
    });
  });

  it("can replace the param value", function (next) {

    var r = router(), i = 0;
    r.param("b", function (request, next) {
      expect(request.get("params.b")).to.be("b");
      i++;
      next(null, "c");
    }); 

    r.add({
      "/a": {
        routes: {
          "/:b": {}
        }
      }
    });

    r.redirect("/a/b", function (err, location) {
      expect(location.get("params.b")).to.be("c");
      expect(i).to.be(1);
      next();
    });
  });


  it("can have a nested param", function (next) {
    var r = router(), i = 0;
    r.param("a.b", function (request, next) {
      expect(request.get("params.a.b")).to.be("abc");
      i++;
      next(null, "c");
    }); 

    r.add({
      "/:a.b": {

      }
    });

    r.redirect("/abc", function (err, location) {
      expect(location.get("params.a.b")).to.be("c");
      expect(i).to.be(1);
      next();
    });
  });
});