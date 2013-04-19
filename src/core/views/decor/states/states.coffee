define ["./state", "bindable", "stepc"], (State, bindable, stepc) ->
    
  class extends bindable.Object

    ###
    ###

    constructor: (@decorator, @options) ->
      super()

      @_id = @name = @options._name

      @view  = decorator.view

      # the view states
      @source = new bindable.Collection()
      @source.enforceId false
      @source.reset (@options.views or @options).map (stateOptions) => new State @, stateOptions

      # initial index
      @set "index", @options.index or 0

      @selector = @options.selector

      # rotate back to zero if at the end
      @rotate = @options.rotate or false

    ###
    ###

    load: (callback) ->
      @once "loadedState", callback
      @bind "index", @_setIndex

    ###
    ###

    render: (callback) ->
      @once "renderedState", callback
      @bind "currentView", @_renderView

    ###
    ###

    display: (callback) ->
      @once "displayedState", callback
      @bind "currentView", @_displayView

    ###
    ###

    remove: (callback) ->
      return callback() if not @_currentView
      @_currentView.remove callback


    ###
    ###

    select: (stateOrIndex) ->
      if typeof stateOrIndex is "number"
        @set "index", stateOrIndex
      else
        i = @source.indexOf stateOrIndex
        if ~i
          @select i


    ###
    ###

    next: () =>
      newIndex = @get("index") + 1

      if newIndex >= @source.length()
        if @rotate
          newIndex = 0
        else
          newIndex = @source.length() - 1
          @emit "ended"

      @set "index", newIndex


    ###
    ###

    prev: () =>
      newIndex = @get("index") - 1

      if newIndex < 0
        if @rotate
          newIndex = @source.length() - 1
        else
          newIndex = 0

      @set "index", newIndex

    ###
    ###

    _setIndex: (index) =>
      return if not @source.length()

      self           = @
      state          = @source.at index or 0
      newState       = state.createView()

      stepc.async(

        # first load the new state in
        (() ->
          newState.loadables.load @
        ),

        # next, remove the OLD state
        (() ->
          return @() if not self._currentView
          self._currentView.remove @
        ),

        # finally, add the new state
        (() ->
          self._currentView = newState
          self.set "currentView", newState
          self.emit "loadedState"
        )
      )

    ###
    ###

    _renderView: (view) =>
      view.element @_element()
      view.render () => @emit "renderedState"


    ###
    ###

    emit: () ->
      super arguments...
      arguments[0] = @name + "." + arguments[0]
      @view.emit arguments...

    ###
    ###

    _displayView: (view) =>
      view.display () => @emit "displayedState"

    ###
    ###

    _element: () ->
      if @selector then @view.$(@selector) else @view.el










