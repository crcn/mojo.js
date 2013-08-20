class Section
  
  ###
  ###

  constructor: (@sections, @name, @viewClass, @options) ->
    
  
  ###
  ###

  createFragment: () ->

    unless @_view
      @_view = new @viewClass()
      @_view.set @options
      @_view._parent = @sections.view
      @_view.display()

    @_view.section.toFragment()


  ###
  ###


module.exports = Section