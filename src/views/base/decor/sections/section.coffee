dref = require "dref"

class Section extends require("bindable").Object
  
  ###
  ###

  constructor: (@sections, @name, @viewClass, options) ->
    super options
    
  
  ###
  ###

  createFragment: () ->

    unless @view
      @view = new @viewClass @
      @view._parent = @sections.view
      @sections.view.callstack.push @view.render

    @view.section.toFragment()



module.exports = Section