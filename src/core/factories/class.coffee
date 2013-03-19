define ["./base"], (BaseFactory) ->
  
  class ClassFactory extends BaseFactory

    ###
    ###

    constructor: (@clazz, @_test) ->

    ###
    ###

    test: (item) -> 
      if @clazz.test
        return @clazz.test(item)

      if @_test
        return @_test(item)

      return true

    ###
    ###

    createItem: (options) -> return new @clazz(options)

    