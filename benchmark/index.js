var Benchmark = require("benchmark"),
suite = new Benchmark.Suite(),
mojo = require("..");

var app = new mojo.Application();



var v = new mojo.View(null, app);


suite.add("view.render()", function () {
  v.remove();
  v._decorated = false;
  v._events = {};
  v.render()
});

suite.add("new mojo.View() without app", function () {
  new mojo.View(null);
});

suite.add("new mojo.View() with app", function () {
  new mojo.View(null, app);
});



suite.on("cycle", function (event) {
  console.log(String(event.target));
});


suite.on("complete", function() {
  console.log("Fastest is '%s'", this.filter("fastest").pluck("name"));
});

suite.run({ async: true });