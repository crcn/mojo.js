paperclip = require "paperclip"
type      = require "type-component"

class PaperclipViewDecorator  

  ###
  ###

  constructor: (@view, @template) ->

    if type(template) isnt "function"
      throw new Error "paper template must be a function for view \"#{@view.constructor.name}\""

    @template = paperclip.template @template

    @view.once "render", @render
    @view.once "remove", @remove

  ###
  ###

  render: () =>
    @content = @template.bind @view
    @view.section.append @content.section.toFragment()

  ###
  ###

  remove: () =>
    @content.unbind()

  ###
  ###

  @getOptions : (view) -> view.paper
  @decorate   : (view, options) -> new PaperclipViewDecorator view, options


module.exports = PaperclipViewDecorator
