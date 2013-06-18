define ["type-component"], (type) ->
  
  class ChildSection
    constructor: (@parentView, @name, viewOrClass) ->
      @view = if viewOrClass.__isView then viewOrClass else new viewOrClass()
      @parentView.linkChild @view

    load    : (next) -> @view.load next
    render  : (next) -> @view.render next
    display : (next) -> @view.display next
    remove  : (next) -> @view.remove next

    toString: () -> 
      @rendered = true
      @view.section.toString()

    @test: (options) -> 
      (type(options) is "function") or options.__isView

  ChildSection