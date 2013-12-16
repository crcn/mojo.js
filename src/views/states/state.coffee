bindable = require "bindable"
_        = require "underscore"

class State extends bindable.Object

  ###
  ###

  constructor: (@states, options, index) ->

    ops = {}

    if not options.viewClass and not options.class
      ops.viewClass = options
    else
      ops = options

    ops.index    = index
    ops.selected = false
    ops._id = options.name or Math.random()

    super @
    @set ops

  ###
  ###

  select: () =>
    @states.select @

  ###
  ###

  remove: () ->
    @_view.set "visible", false
    @_view.dispose()
    @_view = undefined

  ###
  ###

  render: () ->
    @_view.set "visible", true
    @_view.render()

  ###
  ###

  hasView: () -> !!@_view

  ###
  ###

  getView: () -> 
    return @_view if @_view

    # class is deprecated
    clazz = @get("class") ? @get("viewClass")

    @_view = new clazz()

module.exports = State

