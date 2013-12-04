type     = require "type-component"

class SectionsDecorator


  ###
  ###

  constructor: (@view, @sectionOptions) ->
    @init()

  ###
  ###

  init: () ->
    for sectionName of @sectionOptions
      @_addSection sectionName, @_fixOptions @sectionOptions[sectionName]

  ###
  ###

  _addSection: (name, options) ->

    view  = @_createSectionView(options)

    view.once "initialize", () -> view.decorate options
      
    # TODO - this should be deprecated - .render() should be called 
    # by paperclip
    view.createFragment = () =>
      return view.section.toFragment() if view._createdFragment
      view._createdFragment = true
      @view.callstack.unshift view.render
      view.section.toFragment()

    @view.setChild name, view

  ###
  ###

  _fixOptions: (options) -> 

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
    if type(options.type) is "object"
      return options.type
    else
      clazz = @_getSectionClass(options)
      return new clazz options

  ###
  ###

  _getSectionClass: (options) ->

    if (t = type(options.type)) is "function"
      return options.type
    else if t is "string"
      return @view.application.getViewClass(options.type)
    else
      throw new Error "cannot get section class for type #{t}"

  ###
  ###
  
  @priority   : "display"
  @getOptions : (view) -> view.sections
  @decorate   : (view, options) -> new SectionsDecorator view, options

module.exports = SectionsDecorator