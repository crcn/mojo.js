
  
class EitherFactory

  ###
  ###

  constructor: () ->
    @_factories = Array.prototype.slice.call(arguments)

  ###
  ###

  test: (item) ->
    for factory in @_factories
      return true if factory.test item

    return false

  ###
  ###

  create: (item) ->

    for factory in @_factories
      if factory.test item
        return factory.create item

module.exports = EitherFactory


