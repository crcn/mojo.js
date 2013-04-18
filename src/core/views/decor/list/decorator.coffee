###
  list:
    "selector": 
      childView: ChildView
      source: "someSource"
      transform: () ->
###

define ["../selectable", "./list", "../../collection", "../../../utils/async", "../../../utils/idGenerator"], (SelectableDecorator, List, ViewCollection, async, generateId) ->
  
  class ListDecorator extends SelectableDecorator
    name: "list"
    controllerClass: List


  ListDecorator.test = (view) -> !!view.list

  ListDecorator
