bindable = require "bindable"
_        = require "underscore"

class State extends bindable.Object

  ###
  ###

  constructor: (@states, options, index) ->

    ops = {}

    if not options.class
      ops.class = options
    else
      ops = options

    @_id = options.name or Math.random()
    ops.index = index
    ops.selected = false


    super ops

  ###
  ###

  select: () ->
    @states.select @

  ###
  ###

  hide: () ->
    @_view.section.hide()
    @_view.set "visible", false

  ###
  ###

  show: () ->
    @_view.section.show()
    @_view.set "visible", true

  ###
  ###

  hasView: () -> !!@_view

  ###
  ###

  getView: () -> 
    return @_view if @_view
    clazz = @get("class")
    @_view = new clazz()

module.exports = State

