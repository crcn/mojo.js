###
class extends View
  
  states: 
    "#selector": {
      views: [View1, View2]
    }
###

define ["../selectable", "./states"], (SelectableDecorator, States) ->
  
  class StatesDecorator extends SelectableDecorator
    name            : "states"
    controllerClass : States
    

  StatesDecorator.test = (view) -> 
    !!view.states

  StatesDecorator