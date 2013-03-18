define ["dref"],  (dref) ->
  
  class Binding

    ###
    ###

    constructor: (@bindable, @key, @callback) -> 

      # run the listener
      @listener()

    ###
    ###

    listener: () =>

      # fetch the current value of the bound item
      newValue = @bindable.get @key

      # if the item is new, then callback the function
      if @oldValue isnt newValue
        @callback @oldValue = newValue, @oldValue





