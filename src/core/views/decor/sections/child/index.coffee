define ["type-component"], (type) ->
  
  class ChildSection
    constructor: (@parentView, @name, @viewClass) ->
      @view = new @viewClass()

    load: (next) -> 
      @parentView.linkChild @view
      @view.load next

    render: (next) -> @view.render next
    display: (next) -> @view.display next
    remove: (next) -> @view.remove next

    toString: () -> 
      @view.section.toString()

    @test: (options) -> type(options) is "function"

  ChildSection