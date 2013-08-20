BindableInheritableObject = require "../../bindable/inheritable"
models                    = require "../../models"
loaf                      = require "loaf"
flatstack                 = require "flatstack"

class BaseView extends BindableInheritableObject

  ###
  ###
  
  __isView: true

  ###
  ###

  models: models

  ###
  ###

  constructor: (data = {}) ->
    super data

    # bleh - this is a tempory bug. remove!
    @set "models", models

    @section   = loaf()
    @callstack = flatstack()
    
    @init()

  ###
  ###

  init    : () ->
  render  : (next) -> next?()
  remove  : (next) -> next?()

module.exports = BaseView