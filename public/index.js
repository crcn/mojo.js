require(["lib/core/bindings/bindable", 
  "lib/core/templates/factory", 
  "lib/core/views/item",
  "lib/core/views/container",
  "jquery"], 
  function(Binding, TemplateFactory, ItemView, ContainerView) {

  var tf = new TemplateFactory(),
  cv = new ContainerView({
    children: [
      new ItemView({
        template: tf.get("test"),
        data: { name: "john" }
      }),
      new ItemView({
        template: tf.get("test"),
        data: { name: "craig" }
      })
    ]
  });


  cv.attach("#container");

  var i = 0;

  setInterval(function() {
    
    cv.children.addItem(new ItemView({
      template: tf.get("test"),
      data: { name: String(i++) }
    }));

    cv.children.removeItemAt(0)
  }, 500)
});