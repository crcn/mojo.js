define ["./base",  "bindable", "step"], (BaseView, bindable, step) ->

  class StateView extends BaseView


    ###
    ###

    itemTagName: "div"


    ###
    ###

    init: (options) ->
      super options
      @set "currentIndex", 0

      cstates = @get("states")
      states = @states = new bindable.Collection()

      @list = {
        itemTagName: @get("itemTagName")
      }

      states.reset cstates.map (stateClass, index) ->
        stateClass._id = index
        stateClass

      states.on "updated", @_onStatesChange
      @once "list", @_onList


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

    _onList: (list) -> 
      @children = list.itemViews
      @bind("currentIndex", @_onIndexChange)

    ###
    ###

    _onIndexChange: (index) =>


      self = @

      return if not self.states.length()
      children = @children
      newStateClass = self.states.at(index)
      newState = new newStateClass()

      step(

        (() ->
          newState.loadables.load @
        ),

        # wait for the element to be removed before adding the next - what if there's a 
        # transition?
        (() ->
          return @() if not self._currentView
          children.shift()
          @()
        ),

        # after removal, add the new state
        (() -> 
          self._currentView = newState
          self.set "currentView", newState
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








