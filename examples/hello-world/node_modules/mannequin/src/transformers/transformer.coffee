hoist = require "hoist"

module.exports = class

  ###
  ###

  constructor: (@_transformers, @key) ->
    @resetHoist()

  ###
  ###

  default: (value) ->
    return @_defaultValue if not arguments.length
    @_defaultValue = value
    @

  ###
  ###

  cast: (clazz) ->
    @_hoister = @_hoister.cast clazz
    @

  ###
  ###

  resetHoist: () ->
    @_hoister = hoist()

  ###
  ###

  map: (mapper) -> 
    @_hoister = @_hoister.map mapper
    @

  ###
  ###

  reset: () ->
    m = @_transformers.model
    if m.get @key
      m.set @key, @set m.get @key

  ###
  ###

  set: (value) -> 
    @_hoister value or @_defaultValue