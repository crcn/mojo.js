define ["dref"],  (dref) ->
  
  class Binding

    ###
    ###

    constructor: (@bindable, @key, @callback) -> 

      # run the listener
      @_listen()

    ###
    ###

    dispose: () ->
      return if not @_listener
      @_listener.dispose()



    ###
    ###

    _listen: () ->
      keyParts = @key.split "."

      # start from the ROOT property
      event = "change:#{keyParts.shift()}.**"

      @_listener = @bindable.on event, @_onChange

      # call immediately
      @_onChange()


    ###
    ###

    _onChange: () =>

      # fetch the current value of the bound item
      newValue = @bindable.get @key

      # if the item is new, then callback the function
      if @oldValue isnt newValue
        @callback @oldValue = newValue, @oldValue





