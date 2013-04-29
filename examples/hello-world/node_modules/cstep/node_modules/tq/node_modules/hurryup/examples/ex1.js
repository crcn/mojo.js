var hurryUp = require("../");

hurryUp(function(a, next) {
  setTimeout(next, 500, null, a);
}, 500).call(null, "f", function() {
  console.log(arguments)
});


hurryUp(function(next) {
  console.log("RUN")
  next(new Error("fail!"));
}, { retry: true, timeout: 5000 }).call(null, function() {
  console.log(arguments);
});

