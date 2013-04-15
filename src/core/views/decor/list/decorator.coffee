###
  list:
    "selector": 
      childView: ChildView
      source: "someSource"
      transform: () ->
###

define ["../base", "./list", "../../collection", "../../../utils/async", "../../../utils/idGenerator"], (BaseDecorator, List, ViewCollection, async, generateId) ->
  
  class ListDecorator extends BaseDecorator

    ###
    ###

    init: () ->
      super()
      @_collection = new ViewCollection lists = @_setupLists @view.list
      for list in lists
        @view.emit "list", list

    ###
    ###

    load: (callback) -> @_collection.load callback

    ###
    ###

    render: (callback) -> @_collection.render callback

    ###
    ###

    display: (callback) -> @_collection.display callback

    ###
    ###

    remove: (callback) -> @_collection.remove callback

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

    ###
    ###

    _isSingle: (list) -> 
      for key of list
        return true if typeof list[key] isnt "object"
      return false




  ListDecorator.test = (view) -> !!view.list

  ListDecorator
