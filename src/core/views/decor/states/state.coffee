define ["bindable", "underscore"], (bindable, _) ->
  
  class extends bindable.Object

    ###
    ###

    constructor: (@states, options) ->

      ops = {}

      if not options.class
        ops.class = options
      else
        ops = options

      @_id = options.name or Math.random()

      ops.selected = false

      super ops

    ###
    ###

    select: () ->
      @states.select @



    ###
    ###

    createView: () -> 
      clazz = @get("class")
      new clazz()

