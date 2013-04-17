define ["bindable"], (bindable) ->
  
  class extends bindable.Object

    ###
    ###

    constructor: (options) ->
      super()

      @class = options.class or options
      @name  = options.name


    ###
    ###

    createView: () -> new @class()

