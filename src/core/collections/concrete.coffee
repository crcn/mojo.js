define ["./base"], (BaseCollection) ->
  
  class ConcreteCollection extends BaseCollection

    ###
    ###

    itemFactory: (value) ->
      return @_itemFactory if not arguments.length
      @_itemFactory = value
      @

    ###
    ###

    _addItem: (item) ->
      return item if not @_itemFactory
      @_itemFactory.createItem(item)

