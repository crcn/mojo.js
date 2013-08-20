paperclip = require "paperclip"
type      = require "type-component"

class PaperclipViewDecorator  

  ###
  ###

  constructor: (@view, @template) ->

    if type(template) isnt "function"
      throw new Error "paper template must be a function for view \"#{@view.constructor.name}\""

    @template = paperclip.template @template

  ###
  ###

  load: () ->
    @content = @template.bind @view
    @view.section.append @content.section.toFragment()


  remove: () ->
    try
      @content.dispose()
    catch e
      console.error "unable to unbind paperclip template to #{@_traceViewPath()}"
      console.error e.stack or e

  ###
  ###

  _traceViewPath: () ->

    path = []

    cv = @view

    while cv
      path.unshift cv.constructor.name
      cv = cv._parent

    path.join(".")

  ###
  ###

  @getOptions: (view) -> view.paper


module.exports = PaperclipViewDecorator
