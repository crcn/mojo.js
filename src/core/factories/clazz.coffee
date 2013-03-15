define ["factories/base"], (BaseFactory) ->
  
  class ClassFactory extends BaseFactory

    ###
    ###

    constructor: (clazz) ->

    ###
    ###

    createItem: (options) -> return new clazz(options)



  ClassFactory.test = (item) ->
    return typeof item is "function" and !!item.prototype

  ClassFactory

    