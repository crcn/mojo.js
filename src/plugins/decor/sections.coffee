type     = require "type-component"

class SectionsDecorator


  ###
  ###

  constructor: (@view, @sectionOptions) ->
    @init()
    @view.sections.__decorated = true

  ###
  ###

  init: () ->
    for sectionName of @sectionOptions
      @_addSection sectionName, @_fixOptions @sectionOptions[sectionName], sectionName

  ###
  ###

  _addSection: (name, options) ->

    view  = @_createSectionView(options)

    view.once "render", () -> 
      view.decorate options

    @view.setChild name, view

  ###
  ###

  _fixOptions: (options, sectionName) -> 

    # validate
    unless options
      throw new Error "'sections' is invalid for view #{@view.path()}"

    # type must exist. If it doesn't then the options are a type. E.g:
    # section: View
    # section: "component"
    unless options.type
      options = { type: options }

    options

  ###
  ###

  _createSectionView: (options) ->
    if (t = type(options.type)) is "object"
      return options.type
    if t is "function"
      return new options.type(options)
    else if t is "string"
      return @view.application.createView(options.type, options)
    else
      throw new Error "cannot create section for type #{t}"


  ###
  ###
  
  @priority   : "display"
  @getOptions : (view) -> 
    if view.sections and not view.sections.__decorated 
      return view.sections
    else
      return undefined
  @decorate   : (view, options) -> new SectionsDecorator view, options

module.exports = SectionsDecorator