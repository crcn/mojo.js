
class BaseEngine

  ###
  ###

  constructor: (@factory) -> @init()

  ###
  ###

  init: () ->


  ###
   renders a template - must always be asynchronous
  ###

  compile: (source) -> throw new Error("must be overridden")

module.exports = BaseEngine