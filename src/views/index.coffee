models       = require "../models"

DecorableView  = require "./base/decorable"
ListView       = require "./list"
StatesView     = require "./states"

models.set "components.list", ListView
models.set "components.states", StatesView

module.exports = DecorableView