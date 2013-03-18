define ["./binding", "./glue", "eventemitter2", "dref"], (Binding, Glue, events, dref) ->

  
  class Bindable extends events.EventEmitter2

    ###
    ###

    constructor: (@data = {}) ->
      super {
        wildcard: true
      }

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

      @emit "change:#{key}", value
      @emit "change", value



    ###
    ###

    on: (key, listener) ->

      super key, listener

      
      dispose: () =>
        @off key, listener


    ###
     binds a property to a listener. This is called immediately if there's a value
    ###

    bind: (property, listener) -> 
      @on "change:#{property}", new Binding(@, property.replace(/\.\*\*/g, ""), listener).listener


    ###
     Glues two bindable items together
    ###

    glue: (fromProperty, to, toProperty) ->

      if arguments.length is 2
        toProperty = to
        to = @

      new Glue @, fromProperty, to, toProperty


    bindable = new Bindable()

    bindable.set "name.first", "craig"

    console.log("B")






