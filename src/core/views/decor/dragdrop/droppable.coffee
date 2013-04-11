define ["../base", "./collection", "jquery"], (BaseViewDecorator, droppables, $) ->


  class DroppableDecorator extends BaseViewDecorator

    init: () ->
      super()
      @name = @view.get("droppable")
      return
      @view.on "dragenter", @_onDragEnter
      @view.on "dragexit", @_onDragExit 
      @view.on "dragdrop", @_onDrop

    ###
    ###

    display: (callback) ->
      droppables.add @name, @
      callback()

    remove: (callback) ->  
      droppables.remove @name, @
      callback()
    

    _onDragEnter: (view) =>
      console.log "drag enter", view.get("image_url")

    _onDragExit: (view) =>
      console.log "drag exit"

    _onDrop: (view) =>
      console.log "drag drop"




  DroppableDecorator.test = (view) -> view.get("droppable")

  DroppableDecorator