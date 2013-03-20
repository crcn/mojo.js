define ["./base"], (BaseCollection) ->
  
  class ConcreteCollection extends BaseCollection

    ###
     transforms an object with different properties
    ###

    transform: (value) ->
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

    _addItem: (item, index) ->
      item = @_transform item, index
      return item if not @_itemFactory
      @_itemFactory.createItem item


    ###
    ###

    _transform: (item, index) ->
      return item if not @_transformer
      @_transformer item, index

