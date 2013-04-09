define ["./base",  "bindable", "step"], (BaseView, bindable, step) ->

  class StateView extends BaseView

    ###
    ###

    currentIndex: 0

    ###
    ###

    childElement: "div"

    ###
    ###

    init: (options) ->
      super options

      cstates = @get("states")
      @children = new bindable.Collection()
      states = @states = new bindable.Collection()

      states.transform().map (state) ->
        return state if typeof state is "object"
        return new state()

      states.reset cstates
      states.on "updated", @_onStatesChange
      @bind("currentIndex", @_onIndexChange)


    ###
    ###

    nextState: () =>
      ni = @get("currentIndex") + 1

      if ni > @states.length() - 1
        return @emit "noMoreStates"

      @set "currentIndex", Math.min @get("currentIndex") + 1, @states.length() - 1

    ###
    ###

    prevState: () =>
      @set "currentIndex", Math.max @get("currentIndex") - 1, 0

    ###
    ###

    _onIndexChange: (index) =>

      self = @

      return if not self.states.length()
      children = @children

      step(

        # wait for the element to be removed before adding the next - what if there's a 
        # transition?
        (() ->
          return @() if not self._currentView
          children.shift()
        ),

        # after removal, add the new state
        (() ->
          console.log "SHIFT ALT DELETE"
          self._currentView = self.states.at(index)
          self.set "currentView", self._currentView
          children.push self._currentView
          self._onCurrentStateChange()
        )
      )

    ###
    ###

    _childrenElement: () -> 
      childrenElement = @get "childrenElement"
      return @el if not childrenElement
      return @$ childrenElement

    ###
    ###

    _onCurrentStateChange: () =>


    ###
     if the states change then make sure the current state is synced as well
    ###

    _onStatesChange: () =>

      # get the current view based on the state index
      currentView = @states.getItemAt @get "currentIndex"

      # if the two states don't match up, then replace with the new view
      if @_currentView isnt currentView
        @_onIndexChange @get "currentIndex"








