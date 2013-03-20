define ["./factory"], (factoryFactory) ->

  class ABTestFactory

    ###
    ###

    constructor: (control, tests) ->
      @factory = factoryFactory.createItem control.choose tests


    ###
    ###

    createItem: (item) -> @factory.createItem
