###
  Factory that makes Factories! Here's a few use cases

  var classFactory = new ClassFactory(View);
  var clazz = View;

  factoryFactory.createItem(classFactory).createItem(item); //View instance
  factoryFactory.createItem(clazz).createItem(item); //View instance
###


define () ->

  class FactoryFactory 

    ###
    ###

    constructor: () ->
      @_classes = []

    ###
    ###

    addFactoryClass: (factoryClass) ->
      @_classes.push factoryClass

    ###
    ###

    test: (item) -> !!@getFactoryClass item

    ###
    ###

    create: (item) ->

      # is it already a factory? return it!
      if item.create 
        return item

      # otherwise find the factory
      factoryClass = getFactoryClass(item)


      if factoryClass
        return new factoryClass(item)


    ###
    ###

    getFactoryClass: (item) ->
      for factoryClass in @_classes
        if factoryClass.test item
          return factoryClass


  new FactoryFactory()


