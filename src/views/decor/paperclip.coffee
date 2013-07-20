paperclip = require "paperclip"
type      = require "type-component"

class PaperclipViewDecorator  

  ###
  ###

  constructor: (@view, @template) ->

    if type(template) isnt "function"
      throw new Error "paper template must be a function for view \"#{@view.constructor.name}\""

    @paper = paperclip.paper @template

  ###
  ###

  load: () ->
    @paper.load @view
    @view.section.html @view.buffer.join("")

  ###
  ###

  render: () ->

    try 
      # binds the "clips" with the DOM
      @paper.node.bind()
    catch e
      console.error "unable to bind paperclip template to #{@_traceViewPath()}"
      console.error e

  ###
  ###

  remove: () ->
    try
      @paper.node.dispose()
    catch e
      console.error "unable to unbind paperclip template to #{@_traceViewPath()}"
      console.error e

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
