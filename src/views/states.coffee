bindable = require "bindable"
ViewCollection = require "./base/collection"
State = require "./state"
flatstack = require "flatstack"

class StatesView extends require("./base/decorable")
  
  ###
  ###

  _init: () ->
    super()

    @decorators.push {
      load    : @_load
      render  : @_render
      display : @_display
      remove  : @_remove
    }

    @_views = new ViewCollection()

    # the view states
    @source = new bindable.Collection()
    @source.enforceId false
    @source.reset @get("views").map (stateOptions, i) => 
      new State @, stateOptions, i

    @set "source", @source

    @selector = @get("selector")

    # rotate back to zero if at the end
    @rotate = @get("rotate") ? false


    @_callstack = flatstack @

    @bind("currentName").to(@_setName).now()

  ###
  ###

  _load: (next) =>
    @bind("index", @_setIndex).once().now()
    @_views.load next

  ###
  ###

  _render: (next) => @_views.render next

  ###
  ###

  _display: (next) => 
    @bind("index", @_setIndex).now()
    @_views.display next

  ###
  ###

  _remove: (next) => @_views.remove next

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
      if @rotate
        newIndex = @source.length() - 1
      else
        newIndex = 0
        @emit "ended" 
        
    else if newIndex >= @source.length() 
      if @rotate
        newIndex = 0
      else
        newIndex = @source.length() - 1
        @emit "ended"

    @set "index", newIndex

  ###
  ###

  _setName: (name) =>
    for state, i in @source.source()
      if state.get("name") is name
        @set "index", i
        break

  ###
  ###

  _setIndex: (index) =>
    return if not @source.length()


    @currentState?.set "selected", false
    oldState = @currentState

    self           = @
    state          = @currentState = @source.at index or 0
    isNew          = !state.hasView()
    newStateView   = state.getView()
    @linkChild newStateView


    @currentState.set "selected", true

    @_displayListener?.dispose()

    if oldState and oldState isnt @currentState 
      if newStateView.get("currentState") isnt "display"
        @_displayListener = newStateView.once "render display", () =>
          oldState.hide()
      else
        oldState.hide()
    
    
    if isNew
      @_views.push newStateView
      @section.append newStateView.section


    @currentState.show()

    @set "currentView", newStateView

  

module.exports = StatesView