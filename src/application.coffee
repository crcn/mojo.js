bindable  = require "bindable"
_         = require "underscore"
type      = require "type-component"
paperclip = require "mojo-paperclip"
BaseView  = require "./views/base"

defaultComponents = require "./plugins/defaultComponents"
decorators        = require "./plugins/decor"


###
 Main entry point for mojo applications


 app = new Application()

 app.use(router)
 app.use(mediator)

 app.
  registerClass("mainView", MainView).
  createObject("mainView").
  attach($("#application"))

###

class Application extends bindable.Object
  
  ###
  ###

  constructor: () ->
    super @

    # connection between models & views
    @models = new bindable.Object()

    @use defaultComponents
    @use decorators

    # TODO - remove this - should be in another repo
    @use paperclip

    @registerViewClass "base", BaseView

  ###
  ###

  use: (modules...) -> 
    module(@) for module in modules
    @

  ###
  ###

  registerClass: (name, clazz) ->
    @set "models.classes.#{name}", clazz
    @

  ###
  ###

  registerViewClass: (name, clazz) -> @registerClass "views.#{name}", clazz
  registerModelClass: (name, clazz) -> @registerClass "models.#{name}", clazz
  getViewClass: (name) -> @getClass "views.#{name}"
  getModelClass: (name) -> @getClass "models.#{name}"
  getClass: (name) -> @get "models.classes.#{name}"

  ###
  ###

  createObject: (name, options = {}) ->

    if type(name) is "function" 
      clazz = name
    else
      clazz = @get "models.classes.#{name}"

      unless clazz
        throw new Error "class '#{name}' doesn't exist"

    obj = new  clazz options
    obj.set "application", @
    obj.set "models", @models

    obj
    
  ###
  ###

  createView: (name, options) -> @createObject "views.#{name}", options
  createModel: (name, options) -> @createObject "models.#{name}", options


module.exports = Application