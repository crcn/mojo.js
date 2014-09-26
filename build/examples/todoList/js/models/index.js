module.exports = function (application) {
  application.models.register({
    todo: require("./todo"),
    todos: require("./todos")
  })  
}