Section = require "./section"
type    = require "type-component"

class SectionsDecorator


  ###
  ###

  constructor: (@view, @sectionOptions) ->
    @view.set "sections", {}
    @view.once "render", @render

  ###
  ###

  render: () =>
    for sectionName of @sectionOptions
      @_addSection sectionName, @sectionOptions[sectionName]

  ###
  ###

  _addSection: (name, options) ->

    viewClass = @_getSectionClass(options)

    view = new viewClass options
    view._parent = @view
    view.once "initialize", () -> view.decorate options
    @view.callstack.unshift view.render
    @view.set "sections.#{name}", view
    # @view.set "sections.#{name}", new Section(@, name, @_getSectionClass(options), options)

  ###
  ###

  _getSectionClass: (options) ->
    if type(options) is "function"
      return options
    else
      return @view.get("models.components.#{options.type}")

  ###
  ###

  @getOptions : (view) -> view.sections
  @decorate   : (view, options) -> new SectionsDecorator view, options

module.exports = SectionsDecorator