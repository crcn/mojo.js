define ["bindable", "stepc"], (bindable, stepc) ->
    
  class States extends bindable.Object

    ###
    ###

    constructor: (@decorator, @options) ->
      super()


      @_id = @name = @options.name

      @view  = decorator.view

      # the view states
      @views = new bindable.Collection()
      @views.enforceId false
      @views.reset @options.views or @options

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

    next: () ->
      newIndex = @index - 1

      if newIndex >= @views.length
        if @rotate
          newIndex = 0
        else
          newIndex = @views.length - 1

      @set "index", newIndex


    ###
    ###

    prev: () ->
      newIndex = @index - 1

      if newIndex < 0
        if @rotate
          newIndex = @views.length - 1
        else
          newIndex = 0

      @set "index", newIndex

    ###
    ###

    _setIndex: (index) =>
      return if not @views.length()

      self = @
      newStatesClass = @views.at index
      newState = new newStatesClass()

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

    _displayView: (view) =>
      view.display () => @emit "displayedState"


    ###
    ###

    _element: () ->
      if @selector then @view.$(@selector) else @view.el










