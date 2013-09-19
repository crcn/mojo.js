BaseViewDecorator = require "../base"
droppables        = require "./collection"

class DroppableDecorator extends BaseViewDecorator

  ###
  ###

  init: () ->
    super()
    @name = @view.droppable
    @view.once "render", @render
    @view.once "remove", @remove

  ###
  ###

  render: () =>
    droppables.add @name, @

  ###
  ###

  remove: () =>  
    droppables.remove @name, @

  ###
  ###

  @getOptions : (view) -> view.droppable
  @decorate   : (view, options) -> new DroppableDecorator view, options

module.exports = DroppableDecorator