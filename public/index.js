require(["lib/core/bindings/bindable", "lib/core/templates/factory"], function(Binding, TemplateFactory) {

  var tf = new TemplateFactory();

  tf.get("test").render({ name: "craig" }, function(err, data) {
    console.log(data);
  }).render({ name: "john"}, function(err, data) {
    console.log(data);
  })

  var et = new Binding({ name: {first:"john"}});
  et.bind("name.first", function(value) {
    console.log(value)
  });

  et.set("name", { first: "craig" });

});