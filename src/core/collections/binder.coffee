define () ->
  
  class CollectionBinder 

    ###
    ###

    constructor: (from, to) ->

      from.on("add", (event) ->
        to.addItemAt event.item, event.index
      ).
      on("remove", (event) ->
        to.removeItemAt event.index
      ).
      on("reset", (event) ->
        to.source from.source()
      ).
      on("replace", (event) ->
        to.replaceItemAt event.newItem, event.index
      )

      # reset immediately
      to.source from.source()