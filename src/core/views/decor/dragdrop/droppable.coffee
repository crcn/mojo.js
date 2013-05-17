define ["../base", "./collection", "jquery"], (BaseViewDecorator, droppables, $) ->


  class DroppableDecorator extends BaseViewDecorator

    init: () ->
      super()
      @name = @view.droppable

    ###
    ###

    display: (callback) ->
      droppables.add @name, @
      callback()

    remove: (callback) ->  
      droppables.remove @name, @
      callback()



  DroppableDecorator.getOptions = (view) -> view.droppable

  DroppableDecorator