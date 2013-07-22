pilot = require "pilot-block"
State = require "./state"
flatstack = require "flatstack"
bindable = require "bindable"
ViewCollection = require "../../../collection"

class StatesSection extends bindable.Object

  ###
  ### 

  constructor: (@view, @name, @options) ->
    super()

    @_views = new ViewCollection()

    # the view states
    @source = new bindable.Collection()
    @source.enforceId false
    @source.reset (@options.views or @options).map (stateOptions, i) => 
      new State @, stateOptions, i

    # initial index
    @set "index", @options.index or 0
    @set "source", @source

    @selector = @options.selector

    # rotate back to zero if at the end
    @rotate = @options.rotate or false


    @_callstack = flatstack @
    @section = pilot.createSection()

  ###
  ###

  toString: () -> 
    @rendered = true
    @section.toString()

  ###
  ###

  load: (next) ->
    @bind("index", @_setIndex).once().now()
    @_views.load next

  ###
  ###

  render: (next) -> 
    @_views.render next

  ###
  ###

  display: (next) -> 
    @bind("index", @_setIndex).now()
    @_views.display next

  ###
  ###

  remove: (next) -> @_views.remove next

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

  _setIndex: (index) =>
    return if not @source.length()


    @currentState?.set "selected", false
    oldState = @currentState

    self           = @
    state          = @currentState = @source.at index or 0
    isNew          = !state.hasView()
    newStateView   = state.getView()
    @view.linkChild newStateView


    @view.set "index", index

    @currentState.set "selected", true
    
    oldState?.hide()
    
    if isNew
      @_views.push newStateView
      @section.append newStateView.section


    @currentState.show()

    @set "currentView", newStateView


  ###
  ###

  emit: () ->
    super arguments...
    arguments[0] = @name + "." + arguments[0]
    @view.bubble arguments...

  @test: (options) -> options.type is "states"


module.exports = StatesSection