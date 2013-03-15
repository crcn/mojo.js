define ["factories/base"], (BaseFactory) ->
  
  class ClassFactory extends BaseFactory

    ###
    ###

    constructor: (clazz) ->

    ###
    ###


  ClassFactory.test = (item) ->
    return typeof item is "function" and !!item.prototype

  ClassFactory

    