var Benchmark = require("benchmark"),
suite         = new Benchmark.Suite,
subindable    = require("..");

var obj = new subindable.Object({ name: "craig" });


suite.add("new subindable.Object()", function() {
  new subindable.Object();
});

suite.add("subindable.get() defined", function () {
  obj.get("name");
})

suite.add("subindable.get() undefined", function () {
  obj.get("doesNotExist");
})

suite.add("subindable.set('name')", function () {
  obj.set("name", "jeff");
});

suite.add("subindable.set('sub.value')", function () {
  obj.set("sub.value", "jeff");
})

suite.add("subindable.bind() defined", function () {
  obj.bind("name", function(){}).dispose();
})


suite.add("subindable.bind() undefined", function () {
  obj.bind("doesNotExist", function(){}).dispose();
})




suite.on("cycle", function(event) {
  console.log(String(event.target));
});


suite.on("complete", function() {
  console.log("Fastest is '%s'", this.filter("fastest").pluck("name"));
});


suite.run({ async: true });