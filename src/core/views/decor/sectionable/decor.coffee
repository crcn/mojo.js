define ["bindable", "pilot-block"], (bindable, pilot) ->

  class Decor extends bindable.Object

    ###
    ###

    constructor: (@decorator, @options) ->  
      super()

      @_id          = @name = options._name
      @view         = decorator.view
      @sectionName  = options.section
      @itemName     = options.name or "item"

      @section = pilot.createSection()

    ###
    ###

    load: (callback) ->
      @_load () =>
        if @sectionName is "html" and not @view.template
          @view.section.append @section
        else
          @view.set @sectionName, @section
        callback()

    ###
    ###

    _load: (next) -> # OVERRIDE ME