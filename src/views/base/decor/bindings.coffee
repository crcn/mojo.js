BaseViewDecorator = require "./base"
dref              = require "dref"

class BindingsDecorator extends BaseViewDecorator

  ###
  ###

  init: () =>
    super()
    @bindings = if typeof @options is "object" then @options else undefined
    @view.once "render", @render

  ###
  ###

  render: () =>
    @_setupExplicitBindings() if @bindings

  ###
   explicit bindings are properties from & to properties of the view controller
  ###

  _setupExplicitBindings: () ->
    bindings = @bindings
    @_setupBinding key, bindings[key] for key of bindings

  ###
  ###

  _setupBinding: (property, to) ->

    options = {}

    if typeof to is "function" 
      oldTo = to
      to = () =>
        oldTo.apply @view, arguments

    if to.to
      options = to
    else
      options = { to: to }


    options.property = property
    @view.bind(options).now()

  ###
  ###

  @getOptions : (view) -> view.bindings
  @decorate   : (view, options) -> new BindingsDecorator view, options


module.exports = BindingsDecorator