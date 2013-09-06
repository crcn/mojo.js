models       = require "../models"

bindable       = require "bindable"
BaseView       = require "./base/index"
ListView       = require "./list"
StatesView     = require "./states"

models.set "components", new bindable.Object {
  list: ListView,
  states: StatesView
}


module.exports = BaseView