factoryFactory = require "./factory"

class GroupFactory extends require("./base")

  ###
  ###

  constructor: (mandatory = [], optional = [], @groupClass) ->
    @mandatory = mandatory.map factoryFactory.create
    @optional   = optional.map factoryFactory.create

  ###
  ###

  test: (data) -> !!@_getFactories(data, @mandatory).length

  ###
  ###

  create: (data) -> 

    items = []

    for factory in @_getFactories(data, @mandatory)
      items.push factory.create data

    for factory in @_getFactories(data, @optional)
      items.push factory.create data

    if items.length is 1
      return items[0]

    new @groupClass data, items

  ###
  ###

  _getFactories: (data, collection) ->
    factories = []
    for factory in collection
       factories.push(factory) if factory.test(data)
    factories


module.exports = (mandatory, optional, groupClass) -> new GroupFactory mandatory, optional, groupClass