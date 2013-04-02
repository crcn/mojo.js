define ["./base",  "bindable", "step"], (BaseView, bindable, step) ->

  class StateView extends BaseView

    ###
    ###

    currentIndex: 0

    ###
    ###

    init: (options) ->

      super options

      states = new bindable.Collection()

      states.transform().map (state) ->
        return state if typeof state is "object"
        return new state()


      states.reset @get("states") or []
      states.on "updated", @_onStatesChange
      states.bind().to @loadables
      @states = states

    ###
    ###

    _onReady: () =>  
      super()
      @bind "currentIndex", @_onIndexChange


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

      return if not self.states.length() or not @element

      step(

        # wait for the element to be removed before adding the next - what if there's a 
        # transition?
        (() ->
          return @() if not self._currentView
          self._currentView.remove @
        ),

        # after removal, add the new state
        (() ->
          self._currentView = self.states.at(index)
          self.set "currentView", self._currentView
          self._currentView.attach self._childrenElement()
          self._onCurrentStateChange()
        )
      )

    ###
    ###

    _childrenElement: () -> 
      childrenElement = @get "childrenElement"
      return @element if not childrenElement
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








