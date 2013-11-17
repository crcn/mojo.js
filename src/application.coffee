bindable = require "bindable"
_        = require "underscore"
type     = require "type-component"

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

  ###
  ###

  use: (module) -> module @

  ###
  ###

  registerClass: (name, clazz) ->

    # can be many components
    if type(name) is "object" and arguments.length is 1
      components = name
      for name of components
        @registerClass name, components[name]
      return

    @set "models.classes.#{name}", clazz
    @

  ###
  ###

  registerViewClass: (name, clazz) -> @registerClass "views.#{name}", clazz
  registerModelClass: (name, clazz) -> @registerClass "views.#{name}", clazz

  ###
  ###

  createObject: (name, options = {}) ->

    if type(name) is "function" 
      clazz = name
    else
      clazz = @get "models.classes.#{name}"

      unless clazz
        throw new Error "class '#{name}' doesn't exist"

    return new clazz _.extend(options, { application: @ })


module.exports = Application