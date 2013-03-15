require(["lib/core/bindings/bindable", 
  "lib/core/templates/factory", 
  "lib/core/views/item",
  "jquery"], 
  function(Binding, TemplateFactory, ItemView) {

  var tf = new TemplateFactory();

  var cv = new ItemView({
    template: tf.get("test"),
    data: {
      name: "craig"
    }
  });

  cv.attach("#container");

  setTimeout(function() {
    cv.source().set("name", "john");
  }, 500);
});