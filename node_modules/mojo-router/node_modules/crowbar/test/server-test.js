var router = require(".."),
expect     = require("expect.js"),
express    = require("express"),
request    = require("request");

describe("server#", function () {

  var server, p, r, port = process.env.PORT || 8098;

  before(function (next) {
    r = router();
    server = express();
    server.use(r.middleware);
    server.use(function (req, res) {
      res.send(req.location.get("states"));
    })
    p = server.listen(port);

    setTimeout(next, 50);
  });

  it("can redirect to a simple route", function(next) {

    var i = 0;
    
    r.route({
      "/a": {
        states: {
          a: "b",
          b: "c"
        }
      }
    });

    request.get("http://localhost:"+port+"/a", function (err, res, body) {
      body = JSON.parse(body);
      expect(body.a).to.be("b");
      expect(body.b).to.be("c");
      next();
    })
  });

  it("continues if there are no found routes", function(next) {

    var i = 0;
    
    r.route({
      "/a": {
        states: {
          a: "b",
          b: "c"
        }
      }
    });

    request.get("http://localhost:"+port+"/b", function (err, res, body) {
      expect(res.statusCode).to.be(200);
      next();
    })
  });

  after(function () {
    p.close();
  })

});
