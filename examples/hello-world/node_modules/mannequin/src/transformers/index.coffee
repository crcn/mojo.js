Transformer = require "./transformer"
events      = require "eventemitter2"


module.exports = class extends events.EventEmitter2

  ###
  ###

  constructor: (@model) ->  
    super {
      wildcard: true
    }

  ###
  ###
  

  set: (key, value) ->
    target = { key: key, currentValue: value }
    n = @emit key, target
    target.currentValue


  ###
  ###

  use: (key) -> 

    if not key
      event = "**"
    else
      keyParts = key.split(".")

      # start from the ROOT property
      event = "#{keyParts.shift()}.**"

    transformer = new Transformer @, key


    @on event, (target) => 
      return if target.key isnt key
      if not key or (@model.get(key) isnt target.currentValue)
        target.currentValue = transformer.set target.currentValue


    transformer
