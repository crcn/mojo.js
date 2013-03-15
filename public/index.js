require(["lib/core/templates/factory", 
  "require-css!css/main.css",
  "lib/core/views/state",
  "lib/core/views/base",
  "jquery"], 
  function(TemplateFactory, css, StateView, View, $) {

  var tf = new TemplateFactory();

  var v = new View({
    template: tf.get("modal"),
    transition: {
      element: ".modal-container",
      enter: {
        from: { opacity: 0, top: 50 },
        to: { opacity: 1, top: 100 }
      },
      exit: {
        to: { opacity: 0, top: 300 }
      }
    }
  });


  v.attach("#application");
});