var Benchmark = require("benchmark"),
suite = new Benchmark.Suite(),
mojo = require("..");

var app = new mojo.Application();

suite.add("new mojo.View()", function () {
  new mojo.View(null, app);
});

suite.add("view.render()", function () {
  var v = new mojo.View(null, app);
  v.render()
});


suite.on("cycle", function (event) {
  console.log(String(event.target));
});


suite.on("complete", function() {
  console.log("Fastest is '%s'", this.filter("fastest").pluck("name"));
});

suite.run({ async: true });