require(["lib/core/templates/factory", 
  "require-css!css/main.css",
  "require-css!css/style.css",
  "require-css!bootstrap/css/bootstrap.min.css",
  "lib/core/views/state",
  "lib/core/views/base",
  "jquery"], 
  function() {

  var TemplateFactory = require("lib/core/templates/factory"),
  StateView = require("lib/core/views/state"),
  View = require("lib/core/views/base");



  var tf = new TemplateFactory();


  var v = new StateView({
    template: tf.get("add-class-wizard"),
    childrenElement: ".modal-container",
    events: {
      ".close click": "remove"
    },
    transition: {
      ".confirmation-dailog": {
        enter: {
          from: { opacity: 0,  scale: 0.5 },
          to: { opacity: 1,  scale: 1 }
        },
        exit: {
          to: { opacity: 0,  scale: 1.5 }
        }
      },
      ".modal-backdrop": {
        enter: {
          from: { opacity: 0 },
          to: { opacity: 0.75 }
        },
        exit: {
          to: { opacity: 0  }
        }
      }
    }
  });


  v.set("name.title", "FISH!");

  var i = 0;

  setTimeout(function() {
    v.set("name.title", "craig");
  }, 2000);

  v.states.addItem(new View({
    template: tf.get("add-class")
  }));

  v.states.addItem(new View({
    template: tf.get("add-class")
  }));


  // v.setCurrentState(1);





  v.attach("#application");
});