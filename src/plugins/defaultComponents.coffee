views = require "../views"

module.exports = (app) ->
  app.registerClass {
    "views.list"   : views.ListView
    "views.states" : views.StatesView
  }

