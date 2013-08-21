dref = require "dref"

class Section extends require("bindable").Object
  
  ###
  ###

  constructor: (@sections, @name, @viewClass, @options) ->
    super options
    @on "change", @_onChange
    
  
  ###
  ###

  createFragment: () ->

    unless @view
      @view = new @viewClass()
      @view.set @data
      @view._parent = @sections.view
      @sections.view.callstack.unshift @view.render

    @view.section.toFragment()

  ###
  ###

  _onChange: (key, value) =>
    @view?.set key, value



module.exports = Section