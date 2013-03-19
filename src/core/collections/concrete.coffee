define ["./base"], (BaseCollection) ->
  
  class ConcreteCollection extends BaseCollection

    ###
     transforms an object with different properties
    ###

    transformer: (value) ->
      return @_transformer if not arguments.length
      @_transformer = value
      @

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

