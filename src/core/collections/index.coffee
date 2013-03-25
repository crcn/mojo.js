
define ["bindable", "dref"], (bindable, dref) ->
    
  class Collection extends bindable.Collection

    ###
    ###

    constructor: (source = []) ->

      @transform().map (item) ->
        if dref.get(item, "_id") is undefined
          console.error item.get("_id")
          throw new Error "item must have an ID"
        item


      super source

      @indexer (source, item) ->
        _id = dref.get(item, "_id")
        for i in [0...source.length]
          if dref.get(source[i], "_id") is _id
            return i
        return -1




