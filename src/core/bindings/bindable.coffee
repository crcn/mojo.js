define ["./binding", "./glue", "./eventEmitter", "dref"], (Binding, Glue, EventEmitter, dref) ->

  
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
      @_ref @data, key

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

    ###
    ###

    _ref: (context, key) -> 
      return context if not key
      dref.get context, key







