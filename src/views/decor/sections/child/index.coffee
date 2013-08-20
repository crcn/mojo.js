type = require "type-component"


class ChildSection
  __isLoader: true
  constructor: (@parentView, @name, viewOrClass) ->
    @view = if viewOrClass.__isView then viewOrClass else new viewOrClass()
    @section = @view.section
    @parentView.linkChild @view

  load    : (next) -> @view.load next
  render  : (next) -> @view.render next
  display : (next) -> @view.display next
  remove  : (next) -> @view.remove next


  @test: (options) -> 
    (type(options) is "function") or options.__isView

module.exports = ChildSection