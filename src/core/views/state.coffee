define ["./base", "../models/base", "../collections/concrete", "step"], (BaseView, Model, Collection, step) ->
  
  class StateView extends BaseView

    ###
    ###

    init: (options) ->

      super options

      options.defaults {
        currentIndex: 0
      }

      console.log options

      @states = new Collection options.get("states") or []


    ###
    ###

    _attached: () ->  
      @bind "currentIndex", @_onIndexChange


    ###
    ###

    _onIndexChange: (index) =>

      self = @

      step(

        # wait for the element to be removed before adding the next - what if there's a 
        # transition?
        (() ->
          return @() if not self._currentView
          self._currentView.remove @
        ),

        # after removal, add the new state
        (() ->
          self._currentView = self.states.getItemAt(index)
          self._currentView.attach self.element.append("<div />").children().last()
        )
      )








