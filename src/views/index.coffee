models       = require "../models"

BaseView       = require "./base/index"
ListView       = require "./list"
StatesView     = require "./states"

models.set "components.list", ListView
models.set "components.states", StatesView

module.exports = BaseView