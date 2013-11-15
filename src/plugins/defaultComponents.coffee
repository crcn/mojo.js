views = require "../views"

module.exports = (mojo) ->
  mojo.registerClass {
    "views.list"   : views.ListView
    "views.states" : views.StatesView
  }

