bindable  = require "bindable"
_         = require "underscore"
type      = require "type-component"
paperclip = require "mojo-paperclip"
nofactor  = require "nofactor"

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

  constructor: (options = {}) ->
    super @

    # give control over how the DOM is created
    @nodeFactory = options.nodeFactory or nofactor.default

    # connection between models & views
    @models = new bindable.Object()

    # default view components
    @use defaultComponents

    # default decorators
    @use decorators

    # TODO - remove this - should be in another repo
    @use paperclip

  ###
  ###

  use: (modules...) -> 
    module(@) for module in modules
    @

  ###
  ###

  getViewClass       : (name) -> @getClass "views.#{name}"
  registerViewClass  : (name, clazz) -> @registerClass "views.#{name}", clazz
  createView         : (name, options) -> @createObject "views.#{name}", options

  ###
  ###

  getModelClass      : (name) -> @getClass "models.#{name}"
  registerModelClass : (name, clazz) -> @registerClass "models.#{name}", clazz
  createModel        : (name, options) -> @createObject "models.#{name}", options

  ###
  ###

  getClass      : (name) -> @get "models.classes.#{name}"
  registerClass : (name, clazz) ->
    @set "models.classes.#{name}", clazz
    @
    
  createObject  : (name, options = {}) ->

    if type(name) is "function" 
      clazz = name
    else
      clazz = @get "models.classes.#{name}"

      unless clazz
        throw new Error "class '#{name}' doesn't exist"

    obj = new  clazz options, @

    obj


    


module.exports = Application