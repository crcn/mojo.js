require(["lib/core/bindings/bindable", 
  "lib/core/templates/factory", 
  "lib/core/views/item",
  "lib/core/views/container",
  "lib/core/views/state",
  "jquery",
  "structr"], 
  function(Binding, TemplateFactory, ItemView, ContainerView, StateView, $, structr) {


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

  var cv = new StateView({
    states: [
      new PersonView({
        name: "john"
      }),
      new PersonView({
        name: "craig"
      })
    ]
  });


  cv.attach("#container");

  setTimeout(function() {
    cv.set("currentIndex", 1)
  }, 1000);
});