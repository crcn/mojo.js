define ["dref"], (dref) ->
  
  class CollectionGlue 

    ###
    ###

    constructor: (from, to) ->

      @_listeners = from.on({
        "add": (event) ->
          to.addItemAt event.item, event.index
        "remove": (event) ->
          to.removeItemById dref.get event.item, "_id"
        "reset": (event) ->

          for item in event.oldSource
            to.removeItemById dref.get item, "_id"

          for item in event.source
            to.addItem item
      })


      # reset immediately
      to.addItems from.source()

    ###
    ###

    bothWays: () ->
      throw new Error "collection.glue().bothWays() is not implemented yet"


    ###
    ###

    dispose: () ->
      return if not @_listeners
      @_listeners.dispose()