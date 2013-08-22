type    = require "type-component"

class SectionsDecorator


  ###
  ###

  constructor: (@view, @sectionOptions) ->
    @view.set "sections", {}
    @init()

  ###
  ###

  init: () ->
    for sectionName of @sectionOptions
      @_addSection sectionName, @sectionOptions[sectionName]

  ###
  ###

  _addSection: (name, options) ->

    viewClass = @_getSectionClass(options)

    view = new viewClass options
    view._parent = @view
    view.once "initialize", () -> view.decorate options

    
    view.createFragment = () =>
      return view.section.toFragment() if view._createdFragment
      view._createdFragment = true
      @view.callstack.unshift view.render
      view.section.toFragment()

    @view.set "sections.#{name}", view

  ###
  ###

  _getSectionClass: (options) ->

    # type must exist. If it doesn't then the options are a type. E.g:
    # section: View
    # section: "component"
    unless options.type
      options = { type: options }

    if (t = type(options.type)) is "function"
      return options.type
    else if t is "string"
      return @view.get("models.components.#{options.type}")
    else
      throw new Error "cannot get section class for type #{t}"

  ###
  ###

  @getOptions : (view) -> view.sections
  @decorate   : (view, options) -> new SectionsDecorator view, options

module.exports = SectionsDecorator