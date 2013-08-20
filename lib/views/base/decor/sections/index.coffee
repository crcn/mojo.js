Section = require "./section"

class SectionsDecorator


  ###
  ###

  constructor: (@view, @sectionOptions) ->
    @init()

  ###
  ###

  init: () ->
    for sectionName of @sectionOptions
      


  ###
  ###

  @getOptions: (view) -> view.sections


module.exports = SectionsDecorator