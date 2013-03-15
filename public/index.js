require(["lib/core/bindings/bindable", 
  "lib/core/templates/factory", 
  "lib/core/views/item",
  "lib/core/views/container",
  "jquery",
  "structr"], 
  function(Binding, TemplateFactory, ItemView, ContainerView, $, structr) {


  var tf = new TemplateFactory();

  var PersonView = structr(ItemView, {
    template: tf.get("test")
  });


  /*
  
  var sv = new StateView({
    states: [
      new ItemView({ 

      })
    ]
  })

  */

  var cv = new ContainerView({
    children: [
      new PersonView({
        data: { name: "john" }
      }),
      new ItemView({
        data: { name: "craig" }
      })
    ]
  });


  cv.attach("#container");

  var i = 0;

  setInterval(function() {

    cv.children.addItem(new PersonView({
      data: { name: String(i++) }
    }));

    cv.children.removeItemAt(0)
  }, 500)
});