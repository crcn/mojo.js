toarray = require "toarray"
_ = require "underscore"

class GlobalDecorator

  ###
  ###

  constructor: (@view) ->
    @global = []
    @view.bind("global").to(@_setGlobals).now()
    @view.once "child", @_setChild

  ###
  ###

  _setGlobals: (@global = []) =>
    if @view.sections
      for name in @view.sections
        @_setChild @view.sections[name]

  ###
  ###

  _setChild: (child) =>

    cglob = toarray(child.global)

    # make sure there is a change
    return if (joined = _.union(cglob, @global)).length is cglob.length

    global = joined

    for property in @global
      @view.bind(property).to(child, property).now()

    child.set "global", global

  ###
  ###

  @getOptions : (view) -> true
    
  @decorate   : (view, global) -> 
    new GlobalDecorator view, global

module.exports = GlobalDecorator