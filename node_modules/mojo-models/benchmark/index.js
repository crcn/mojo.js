var Benchmark = require("benchmark"),
suite = new Benchmark.Suite(),
models = require(".."),
Application = require("mojo-application");

var app = new Application();
app.use(models);


suite.add("new models.Base()", function () {
  new models.Base(null, app)
});

suite.on("cycle", function (event) {
  console.log(String(event.target));
});

suite.on("complete", function() {
  console.log("Fastest is '%s'", this.filter("fastest").pluck("name"));
});

suite.run({ async: true });