application.use(require("./models/index"));
application.use(require("./views/index"));

application.bootstrap(function () {

  var main = application.views.create("main", {
    todos: application.models.create("todos", {
      data: [
        { text: "clean car", done: true },
        { text: "walk dog", done: false }
      ]
    })
  });

  document.body.appendChild(main.render());
});
