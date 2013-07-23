View     = require "./views"
mediator = require "./mediator"
bindable = require "bindable"
models   = require "./models/locator"

module.exports = 
  View     : View
  mediator : mediator
  bindable : bindable
  models   : View.models