define ["./eventTree", "./binding", "dref"], (EventTree, Binding, dref) ->
  
  class Bindable

    ###
    ###

    constructor: (@data = {}) ->
      @_emitter = new EventTree()


    ###
    ###

    get: (key) -> dref.get @data, key


    ###
    ###

    set: (key, value) -> 
      dref.set @data, key, value
      @_emitter.emit key

    ###
     called immediately
    ###

    bind: (property, listener) ->
      @_emitter.on property, new Binding(@, property, listener).listener






