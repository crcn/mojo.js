define ["dref"],  (dref) ->
  
  class Binding

    ###
    ###

    constructor: (@bindable, @key, @callback) -> 
      @listener()

    ###
    ###

    listener: () =>

      newValue = @bindable.get @key

      if @oldValue isnt newValue
        @callback @oldValue = newValue, @oldValue




