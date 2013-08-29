BaseViewDecorator = require "../base"
droppables        = require "./collection"

class DroppableDecorator extends BaseViewDecorator

  ###
  ###

  init: () ->
    super()
    @name = @view.droppable

  ###
  ###

  display: () ->
    droppables.add @name, @

  ###
  ###

  remove: () ->  
    droppables.remove @name, @


DroppableDecorator.getOptions = (view) -> view.droppable

module.exports = DroppableDecorator