define ["../bindings/eventEmitter", "underscore", "./bindings/glue", "dref"], (EventEmitter, _, Glue, dref) ->
  
  _id = 0

  generateId = () -> _id++

  
  class BaseCollection extends EventEmitter

    ###
    ###

    constructor: (source) ->
      super()
      @_source = source or []
      @_itemsById = {}

    ###
    ###

    clone: (bind) ->
      clone = new @prototype.constructor()

      if bind isnt false
        @bindTo clone

      clone

    ###
    ###

    length: () -> @_source.length

    ###
    ###

    glue: (target) -> new Glue @, target

    ###
    ###

    glueFrom: (source, context) ->
      new Glue source, @, context


    ###
    ###

    source: (value) ->

      # bind instead of setting the source
      if value instanceof BaseCollection
        value.glue @
        return @


      return @_source.concat() if not arguments.length
      @_emit "reset", { oldSource: @_source, source: @_source = @_addChildren(value) }


    ###
    ###

    _addChildren: (source) ->
      transformed = []

      for item, i in source
        transformed.push @_addItem item, i


      transformed


    ###
    ###

    addItems: (source) ->
      for item in source
        @addItem item

    ###
    ###

    addItem: (item) ->
      @addItemAt item, @_source.length

    ###
    ###

    getItemAt: (index) -> @_source[index]

    ###
    ###

    getItemIndex: (item) -> @_source.indexOf item

    ###
    ###

    addItemAt: (item, index) ->

      if not dref.get item, "_id"
        dref.set item, "_id", generateId()

      if @_itemsById[dref.get(item, "_id")]
        return false




      item = @_addItem item, index

      # shove the raw data into items by id
      @_itemsById[dref.get(item, "_id")] = item

      @_source.splice index, 0, item
      @_emit "add", { item: item, index: index + 1, _id: dref.get(item, "_id") }

    ###
    ###

    removeItem: (item) ->
      @removeItemAt @_source.indexOf item


    ###
    ###

    removeItemAt: (index) ->
      return false if not ~index
      item = @_source[index]
      delete @_itemsById[dref.get(item, "_id")]
      @_removeItem item
      @_source.splice index, 1
      @_emit "remove", { item: item, index: index, _id: dref.get(item, "_id")  }


    ###
    ###

    removeItemById: (id) ->
      item = @_itemsById[id]
      return false if not item
      @removeItem item

    ###
    ###

    _emit: (type, data) ->
      @emit type, data
      @emit "updated", _.extend({ type: type }, data)

    ###
    ###

    _addItem: (item, index) -> item
    _removeItem: (item, index) -> item




