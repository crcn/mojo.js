define ["../base", "./collection", "jquery", "underscore"], (BaseViewDecorator, droppables, $, _) ->


  class DraggableDecorator extends BaseViewDecorator

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
      el = @view.el
      @document = $(document)
      el.bind "mousedown", @_startDrag

    ###
    ###

    _startDrag: (e) =>

      # prevent original drag - might be an image
      e.preventDefault()

      @document.bind "mousemove", @_drag
      @document.one "mouseup", @_stopDrag

      @_offset = { x: e.offsetX, y: e.offsetY }

      @draggedItem = @document.find("body").append(@view.el.html()).children().last()

      @draggedItem.css { "z-index": 99999999, "position": "absolute", "opacity": 0.8  }
      @draggedItem.transit { scale: 1.5 }
      @_followMouse e


    _stopDrag: (e) =>
      droppables.drop @name, @_event e
      @document.unbind "mousemove", @_mouseMoveListener
      @draggedItem.remove()



    _drag: (e) =>
      droppables.drag @name, @_event e
      @_followMouse e


    _event: (e) => { view: @view, draggedItem: @draggedItem, mouse: { x: e.pageX, y: e.pageY } }


    _coords: (e) => { left: e.pageX - @_offset.x, top: e.pageY - @_offset.y }

    _followMouse: (e) =>
      @draggedItem.css(@_coords(e))

  DraggableDecorator.test = (view) -> view.draggable

  DraggableDecorator