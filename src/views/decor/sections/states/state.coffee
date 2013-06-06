define ["bindable", "underscore"], (bindable, _) ->
  
  class extends bindable.Object

    ###
    ###

    constructor: (@states, options, index) ->

      ops = {}

      if not options.class
        ops.class = options
      else
        ops = options

      @_id = options.name or Math.random()
      ops.index = index
      ops.selected = false

      super ops

    ###
    ###

    select: () ->
      @states.select @

    ###
    ###

    hide: () ->
      @_view.section.detach()
      @_view.set "visible", false

    ###
    ###

    show: () ->
      @_view.section.attach()
      @_view.set "visible", true

    ###
    ###

    getView: () -> 
      return @_view if @_view
      clazz = @get("class")
      @_view = new clazz()

