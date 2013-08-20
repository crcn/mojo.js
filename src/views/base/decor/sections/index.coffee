Section = require "./section"
type    = require "type-component"

class SectionsDecorator


  ###
  ###

  constructor: (@view, @sectionOptions) ->
    @init()

  ###
  ###

  init: () ->
    for sectionName of @sectionOptions
      @_addSection sectionName, @sectionOptions[sectionName]

  ###
  ###

  _addSection: (name, options) ->
    @view.set "sections.#{name}", new Section(@, name, @_getSectionClass(options), options)

  ###
  ###

  _getSectionClass: (options) ->
    if type(options) is "function"
      return options
    else
      return @view.get("models.components.#{options.type}")

  ###
  ###

  @getOptions: (view) -> view.sections


module.exports = SectionsDecorator