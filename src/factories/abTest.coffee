factoryFactory = require "./factory"



class ABTestFactory

  ###
  ###

  constructor: (control, tests) ->
    @factory = factoryFactory.create control.choose tests


  ###
  ###

  create: (item) -> @factory.create

module.exports = ABTestFactory
