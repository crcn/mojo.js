###
class extends View
  
  states: 
    "#selector": {
      views: [View1, View2]
    }
###

define ["../sectionable/index", "./states"], (Sectionable, States) ->
  
  class StatesDecorator extends Sectionable
    name            : "states"
    controllerClass : States
    

  StatesDecorator.test = (view) -> !!view.states

  StatesDecorator