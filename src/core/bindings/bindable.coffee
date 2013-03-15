define ["./eventTree", "./binding", "events", "dref"], (EventTree, Binding, events, dref) ->
  
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
     called immediately
    ###

    bind: (property, listener) ->

      if arguments.length is 1
        listener = property
        property = undefined

      @_emitter.on property, new Binding(@, property, listener).listener






