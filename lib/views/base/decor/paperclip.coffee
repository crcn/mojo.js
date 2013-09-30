paperclip = require "paperclip"
type      = require "type-component"

class PaperclipViewDecorator  

  ###
  ###

  constructor: (@view) ->
    @view.once "render", @render
    @view.once "remove", @remove
    @view._define "paper"
    @view.bind("paper").to(@_onTemplateChange).now()

  ###
  ###

  _onTemplateChange: (template) =>

    console.log @view.path(), "G"

    if type(template) isnt "function"
      throw new Error "paper template must be a function for view \"#{@view.constructor.name}\""

    @template = paperclip.template template

    if @_rendered
      @cleanup true
      @render()


  ###
  ###

  render: () =>
    @_rendered = true
    @content = undefined
    return unless @template
    @content = @template.bind @view
    @content.section.show()
    @view.section.append @content.section.toFragment()

  ###
  ###

  remove: () => 
    @cleanup()

  ###
  ###

  cleanup: (hide) =>
    @content?.unbind()
    if hide
      @content?.section.hide()

  ###
  ###

  @getOptions : (view) -> 

    return if (/StatesView|ListView/.test(String(view.constructor?.name))


    return (type(view) is "object") and not /StatesView|ListView/.test(String())

  @decorate   : (view, options) -> new PaperclipViewDecorator view, options


module.exports = PaperclipViewDecorator
