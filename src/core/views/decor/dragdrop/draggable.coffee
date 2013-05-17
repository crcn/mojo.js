define ["../base", "./collection", "jquery", "underscore"], (BaseViewDecorator, droppables, $, _) ->


  class DraggableDecorator extends BaseViewDecorator

    ###
    ###

    init: () ->
      super()
      @name = @view.draggable

    ###
    ###

    display: (callback) ->
      @_initListeners()
      callback()

    
    remove: (callback) ->  
      callback()


    ###
    ###

    _initListeners: () =>
      el = @view.$()
      @document = $(document)
      el.bind "mousedown", @_startDrag

      # gets IE to work
      el.bind "dragstart", () =>

    ###
    ###

    _startDrag: (e) =>

      el = @view.$()


      @document.bind "mousemove", @_drag
      @document.one "mouseup", @_stopDrag

      # layerX = firefox
      @_offset = { x: e.offsetX or el.width()/2, y: e.offsetY or el.height()/2 }



      @draggedItem = @document.find("body").append(el.html()).children().last()



      @draggedItem.css { "z-index": 99999999, "position": "absolute", "opacity": 0.8  }
      @draggedItem.transit { scale: 1.5 }
      @_followMouse e

      # prevent original drag - might be an image
      # e.preventDefault()
      e.stopPropagation()
      true


    _stopDrag: (e) =>
      droppables.drop @name, @_event e
      @document.unbind "mousemove", @_mouseMoveListener
      @draggedItem.remove()



    _drag: (e) =>
      droppables.drag @name, @_event e
      @_followMouse e


    _event: (e) => 
      { view: @view, draggedItem: @draggedItem, mouse: { x: e.pageX, y: e.pageY } }


    _coords: (e) => { left: e.pageX - @_offset.x, top: e.pageY - @_offset.y }

    _followMouse: (e) =>
      @draggedItem.css @_coords(e)

  DraggableDecorator.getOptions = (view) -> view.draggable

  DraggableDecorator