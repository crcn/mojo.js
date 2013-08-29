BaseFactory    = require "./base"
factoryFactory = require "./factory"


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

  create: (options) -> return new @clazz(options)



ClassFactory.test = (item) ->
  return (typeof item == "function") && item.prototype


factoryFactory.addFactoryClass ClassFactory


module.exports = ClassFactory


  