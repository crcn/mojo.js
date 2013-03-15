define ["events", "underscore", "./binder"], (events, _, Binder) ->
  
  class BaseCollection extends events.EventEmitter

    ###
    ###

    constructor: (source) ->
      super()
      @_source = source or []

    ###
    ###

    clone: (bind) ->
      clone = new @prototype.constructor()

      if bind isnt false
        @bindTo clone

      clone

    ###
    ###

    bindTo: (target) ->
      new Binder @, target
      @

    ###
    ###

    source: (value) ->

      # bind instead of setting the source
      if value instanceof BaseCollection
        value.bindTo @
        return @


      return @_source.concat() if not arguments.length
      @_emit "reset", { source: @_source = value }

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
      @_source.splice index, 0, @_addItem item
      @_emit "add", { item: item, index: index }

    ###
    ###

    removeItem: (item) ->
      @removeItemAt @_source.indexOf item

    ###
    ###

    removeItemAt: (index) ->
      return false if not ~index
      item = @_source[index]
      @_removeItem item
      @_source.splice index, 1
      @_emit "remove", { item: item, index: index }

    ###
    ###

    replaceItem: (oldItem, newItem) ->
      @replaceItemAt @_source.indexOf oldItem

    ###
    ###

    replaceItemAt: (newItem, index) ->
      return false if not ~index
      oldItem = @_source[index]
      @_source.splice index, 1, @_addItem newItem
      @_emit "replace", { oldItem: oldItem, newItem: newItem, index: index }

    ###
    ###

    _emit: (type, data) ->
      @emit type, data
      @emit "updated", _.extend({ type: type }, data)

    ###
    ###

    _addItem: (item) -> item
    _removeItem: (item) -> item




