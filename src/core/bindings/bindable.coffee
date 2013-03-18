define ["./binding", "./glue", "./eventEmitter", "dref", "disposable"], (Binding, Glue, EventEmitter, dref, disposable) ->

  
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






