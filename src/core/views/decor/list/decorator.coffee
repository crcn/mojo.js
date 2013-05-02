###
  list:
    "selector": 
      childView: ChildView
      source: "someSource"
      transform: () ->
###

define ["../selectable", "./list"], (SelectableDecorator, List) ->
  
  class ListDecorator extends SelectableDecorator
    name: "list"
    controllerClass: List


  ListDecorator.test = (view) -> !!view.list

  ListDecorator
