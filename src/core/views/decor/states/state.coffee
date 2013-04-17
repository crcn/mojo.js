define ["bindable"], (bindable) ->
  
  class extends bindable.Object

    ###
    ###

    constructor: (options) ->
      super()

      @class = options.class or options
      @name  = options.name
      @_id = options.name or Math.random()


    ###
    ###

    createView: () -> new @class()

