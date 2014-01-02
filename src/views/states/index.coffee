bindable  = require "bindable"
State     = require "./state"
flatstack = require "flatstack"


###
###

class StatesView extends require("../base")

  ###
  ###

  _decorated: true

  ###
  ###

  define: ["currentName", "index", "source", "currentView", "rotate", "ended", "views"]

  ###
  ###
  
  ended: false

  ###
  ###

  initialize: (data) ->
    source = new bindable.Collection()
    @set "source", source
    super data
    @bind("views", { to: @_setViews }).now()

  ###
  ###

  _setViews: (views) =>

    @source.reset views.map (stateOptions, i) => 
      new State @, stateOptions, i

    if @_rendered
      @_rebind()
  ###
  ###

  render: () ->
    sect = super()
    @_rebind()
    sect

  ###
  ###

  _rebind: () ->

    @_indexBinding?.dispose()
    @_cnameBinding?.dispose()

    @_indexBinding = @bind("index", { to: if process.browser then @_setIndexWithAnimation else @_setIndex }).now()
    @_cnameBinding = @bind("currentName", { to: @_setName }).now()

  ###
   selects a state 
  ###

  select: (stateOrIndex) ->
    if typeof stateOrIndex is "number"
      @set "index", stateOrIndex
    else
      i = @source.indexOf stateOrIndex
      if ~i
        @select i

  ###
   Moves onto the next state
  ###

  next: () => @move()

  ###
   Moves to the previous state
  ###

  prev: () => @move -1 

  ###
  ###

  move: (position = 1) ->
    newIndex = @get("index") + position

    if newIndex < 0
      if @get("rotate")
        newIndex = @source.length - 1
      else
        newIndex = 0
        @set "ended", true
        
    else if newIndex >= @source.length
      if @get("rotate")
        newIndex = 0
      else
        newIndex = @source.length - 1
        @set "ended", true

    @set "index", newIndex

  ###
  ###

  _setName: (name) =>
    return unless name
    for state, i in @source.source()
      if state.get("name") is name
        @set "index", i
        break

  ###
  ###

  _setIndexWithAnimation: () =>
    requestAnimationFrame @_setIndex

  ###
  ###

  _setIndex: () =>
    return if not @source.length

    @currentState?.set "selected", false
    oldState = @currentState

    self           = @
    state          = @currentState = @source.at @index or 0
    isNew          = !state.hasView()
    newStateView   = state.getView()

    @setChild "currentChild", newStateView
    @currentState.set "selected", true

    @_displayListener?.dispose()

    if oldState and oldState isnt @currentState 
        oldState.remove()

    state.render()
    
    if isNew
      @section.append newStateView.section.toFragment()


    @set "currentView", newStateView

  

module.exports = StatesView