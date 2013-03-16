define ["./eventTree", "./binding", "./glue", "events", "dref"], (EventTree, Binding, Glue, events, dref) ->
  
  class Bindable extends events.EventEmitter

    ###
    ###

    constructor: (@data = {}) ->
      @_emitter = new EventTree()


    ###
    ###

    get: (key) -> 
      return @data if not key
      dref.get @data, key

    ###
    ###

    has: (key) -> !!@get key

    ###
    ###

    set: (key, value) -> 

      if arguments.length is 1
        @data = value
      else 
        dref.set @data, key, value

      @_emitter.emit key

      @emit "update", { key: key, value: value }


    ###
     binds a property to a listener. This is called immediately if there's a value
    ###

    bind: (property, listener) ->

      if arguments.length is 1
        listener = property
        property = undefined
  
      @watch property, new Binding(@, property, listener).listener


    ###
    ###

    unbind: (property, listener) ->
      throw new Error("not implemented yet")

    ###
     Glues two bindable items together
    ###

    glue: (fromProperty, to, toProperty) ->

      if arguments.length is 2
        toProperty = to
        to = @

      new Glue @, fromProperty, to, toProperty


    ###
     watches for any change in the bindable data. This is ONLY called on change
    ###

    watch: (property, listener) ->

      if arguments.length is 1
        listener = property
        property = undefined

      @_emitter.on property, listener






