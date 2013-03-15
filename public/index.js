require(["lib/core/bindings/bindable", 
  "lib/core/templates/factory", 
  "lib/core/views/base",
  "jquery"], 
  function(Binding, TemplateFactory, BaseView) {

  var tf = new TemplateFactory();

  var cv = new BaseView({
    template: tf.get("test"),
    data: {
      name: "craig"
    }
  })

  cv.attach($("#container"));

});