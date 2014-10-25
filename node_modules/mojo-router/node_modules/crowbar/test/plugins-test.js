var router = require(".."),
expect     = require("expect.js");

describe("plugins#", function () {

  it("can call the use() method", function () {
    var r = router(),
    i = 0;

    r.use(function (router) {
      expect(router).to.be(r);
      i++;
    });


    expect(i).to.be(1);
  });

  it("can pass multiple plugins into use()", function () {
    var r = router(),
    i = 0;

    r.use(function (router) {
      expect(router).to.be(r);
      i++;
    },
    function (router) {
      expect(router).to.be(r);
      i++;
    });


    expect(i).to.be(2);
  });

  it("can add a route decorator", function () {
    var r = router(), i = 0;

    r.use(function (router) {
      router.routes.decorators.add({
        test: function (route) {
          i++;
        }
      })
    });


    r.add({
      "/a": {}
    });

    // account for root
    expect(i).to.be(2);
  });

});