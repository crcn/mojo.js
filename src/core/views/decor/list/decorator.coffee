###
  list:
    "selector": 
      childView: ChildView
      source: "someSource"
      transform: () ->
###

define ["../sectionable/index", "./list"], (Sectionable, List) ->
  
  class ListDecorator extends Sectionable
    name: "list"
    controllerClass: List


  ListDecorator.test = (view) -> !!view.list

  ListDecorator
