Section = require "./section"
type    = require "type-component"
ViewCollection = require "../../collection"

class SectionsDecorator


  ###
  ###

  constructor: (@view, @sectionOptions) ->
    @_views = new ViewCollection()
    @init()

  ###
  ###

  load    : (next) -> @_views.load next
  render  : (next) -> @_views.render next
  display : (next) -> @_views.display next
  remove  : (next) -> @_views.remove next

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

  _initialized: (section) -> 
    @_views.push section.view


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