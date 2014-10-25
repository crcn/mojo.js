ClassFactory = require "./class"
type         = require "type-component"
FnFactory    = require "./fn"

class FactoryFactory extends require("./base")

  ###
  ###

  constructor: () ->

  ###
  ###

  create: (data) ->

    if data.create and data.test
      return data
    else if (t = type(data)) is "function"
      if data.prototype.constructor
        return new ClassFactory data
      else
        return new FnFactory data

    return data


factory = new FactoryFactory()

module.exports = factory