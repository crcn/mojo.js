define ["dref"], (dref) ->
  
  class CollectionGlue 

    ###
    ###

    constructor: (@from, @to, @context) ->

      tof = typeof @from

      if @from instanceof Array
        @_glueArray()
      else if from.source
        @_glueCollection()
      else if tof is "string"
        @_glueBindable()

      
    ###
    ###

    _glueArray: () ->
      @to.source @from

    ###
    ###

    _glueCollection: () ->
      @_listeners = @from.on({
        "add": (event) =>
          @to.addItemAt event.item, event.index
        "remove": (event) =>
          @to.removeItemById dref.get event.item, "_id"
        "reset": (event) =>

          for item in event.oldSource
            @to.removeItemById dref.get item, "_id"

          for item in event.source
            @to.addItem item
      })


      
      # reset immediately
      @to.addItems @from.source()

    ###
    ###

    _glueBindable: () ->
      @context.bind @from, (source) =>

        if @_prevGlue 
          @_prevGlue.dispose()

        @to.source source






    ###
    ###

    bothWays: () ->
      throw new Error "collection.glue().bothWays() is not implemented yet"


    ###
    ###

    dispose: () ->
      return if not @_listeners
      @_listeners.dispose()