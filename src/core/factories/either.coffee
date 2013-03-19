define [], () ->
  
  class EitherFactory

    ###
    ###

    constructor: () ->
      @_factories = Array.prototype.slice.call(arguments)

    ###
    ###

    test: (item) ->
      for factory in @_factories
        return true if factory.test item

      return false

    ###
    ###

    createItem: (item) ->

      for factory in @_factories
        if factory.test item
          return factory.createItem item


