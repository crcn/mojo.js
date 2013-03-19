define ["../bindings/eventEmitter", "underscore", "./glue", "dref"], (EventEmitter, _, Glue, dref) ->
  
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

    source: (value) ->

      # bind instead of setting the source
      if value instanceof BaseCollection
        value.glue @
        return @


      return @_source.concat() if not arguments.length
      @_emit "reset", { oldSource: @_source, source: @_source = value }


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

    addItemAt: (item, index) ->

      if not dref.get item, "_id"
        dref.set item, "_id", generateId()

      if @_itemsById[dref.get(item, "_id")]
        return false

      item = @_addItem item

      @_itemsById[dref.get(item, "_id")] = item

      @_source.splice index, 0, item
      @_emit "add", { item: item, index: index, _id: dref.get(item, "_id") }

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

    _addItem: (item) -> item
    _removeItem: (item) -> item




