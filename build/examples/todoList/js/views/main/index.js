module.exports = mojo.views.Base.extend({
  paper: require("text!index.pc"),
  children: {
    todos: {
      type: "list",
      source: "todos",
      modelViewClass: require("./todo/index")
    }
  },
  addNewTodo: function () {
    if (!this.newTodoText) return;
    this.todos.create({ text: this.newTodoText });
    this.set("newTodoText", void 0);
  },
  clearTodos: function () {
    for (var i = this.todos.length; i--;) {
      if (this.todos.at(i).get("done")) {
        this.todos.splice(i, 1);
      }
    }
  }
});