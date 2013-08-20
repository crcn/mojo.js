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
      @sections._initialized @

    @view.section.toFragment()






module.exports = Section