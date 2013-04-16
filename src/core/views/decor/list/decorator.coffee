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

    ###
    ###

    _setupLists: (lists) ->
  
      # only one list provided? 
      return [new List(generateId(), @view, lists.selector or @view.el, lists)] if @_isSingle lists

      _lists = []

      for key of lists

        # something like childList .selector
        keyParts = key.split(" ")
        selector = keyParts.pop()
        property = keyParts.pop()

        list = new List property or selector, @view, selector, lists[key]

        if property
          @view[property] = list

        _lists.push list

      _lists


  ListDecorator.test = (view) -> !!view.list

  ListDecorator
