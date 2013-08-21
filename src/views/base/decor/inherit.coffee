toarray = require "toarray"

class InheritDecorator

  ###
  ###

  constructor: (@view, @inherit) ->
    view.once "render", @render

  ###
  ###

  render: () =>
    return unless @view._parent
    console.log @view.path()
    @_bindings = for inherit in @inherit then do (inherit) =>
      @view._parent.bind(inherit).to(@view, inherit).now()

  ###
  ###

  @getOptions : (view) -> if view.inherit then toarray(view.inherit) else undefined
  @decorate   : (view, inherit) -> new InheritDecorator view, inherit

module.exports = InheritDecorator