bindable                  = require "bindable"
models                    = require "../../models"
loaf                      = require "loaf"
flatstack                 = require "flatstack"

class BaseView extends bindable.Object

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

  ###
  ###
  
  render  : (next) -> next?()

  ###
  ###

  remove  : (next) -> next?()


  ###
  ###

  linkChild: () ->
    for child in arguments
      child._parent = @
    @
    
  ###
   bubbles up an event to the root object
  ###

  bubble: () ->
    @emit arguments...
    @_parent?.bubble arguments...

module.exports = BaseView