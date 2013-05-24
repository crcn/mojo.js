define ["./state", "bindable", "stepc", "pilot-block", "../sectionable/decor", "../../collection"], (State, bindable, stepc, pilot, Decor, ViewCollection) ->
    
  class extends Decor

    ###
    ###

    constructor: () ->
      super arguments...

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


    ###
    ###

    _load: (callback) ->
      @bind "index", @_setIndex
      @bind("currentView").once().to callback

    ###
    ###

    render: (callback) -> @_currentView.render callback

    ###
    ###

    display: (callback) -> @_currentView.display callback

    ###
    ###

    remove: (callback) -> @_currentView.remove callback

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
      newStateView   = state.getView()
      @view.linkChild newStateView

      @view.set "index", index

      @currentState.set "selected", true

      oldView = self._currentView

      stepc.async(
        
        # first load the new state in
        (() ->
          newStateView[self.view.get("currentState")].call newStateView, @
        ),

        (() ->

          # just hide the state - might want to re-use it again
          oldState?.hide()
          @()
        ),

        # finally, add the new state
        ((err) ->
          if err
            console.error err

          # set the nw start
          self._currentView = newStateView

          self.section.append newStateView.section
          self.currentState.show()

          self.set "currentView", newStateView
        )
      )

    ###
    ###

    emit: () ->
      super arguments...
      arguments[0] = @name + "." + arguments[0]
      @view.bubble arguments...







