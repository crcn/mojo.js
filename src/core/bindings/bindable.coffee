define ["./binding", "./glue", "./eventEmitter", "dref"], (Binding, Glue, EventEmitter, dref) ->

  dref.use {
    test: (item) -> item.get && item.set
    get: (item, key) -> item.data[key] or item[key]
    set: (item, key, value) -> item.set key, value
  }

  
  class Bindable extends EventEmitter

    ###
    ###

    constructor: (@data = {}) ->
      super {
        wildcard: true
      }


    ###
    ###

    get: (key) -> 
      @_ref(@data, key) or @_ref @, key

    ###
    ###

    has: (key) -> !!@get key

    ###
    ###

    set: (key, value) -> 

      if arguments.length is 1
        for k of key
          @set k, key[k]
        return

      dref.set @data, key, value

      @emit "change:#{key}", value
      @emit "change", value




    ###
     binds a property to a listener. This is called immediately if there's a value
    ###

    bind: (property, listener) -> new Binding @, property, listener


    ###
     Glues two bindable items together
    ###

    glue: (fromProperty, to, toProperty) ->

      if arguments.length is 2
        toProperty = to
        to = @

      new Glue @, fromProperty, to, toProperty

    ###
    ###

    _ref: (context, key) -> 
      return context if not key
      dref.get context, key









