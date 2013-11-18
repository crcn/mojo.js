BaseViewDecorator   = require "./base"
EventsDecorator     = require "./events"
SectionsDecorator   = require "./sections/index"
DraggableDecorator  = require "./dragdrop/draggable"
DroppableDecorator  = require "./dragdrop/droppable"
TransitionDecorator = require "./transition"
PreloadDecorator    = require "./preload"
bindableDecor       = require "bindable-decor"
bindableDecorbindings = require "bindable-decor-bindings"


module.exports = (app) ->

  decor = bindableDecor()


  decor.priority("load", 0).
  priority("render", 1).
  priority("display", 2).
  use(

    # bindings = priority for explicit data-bindings
    bindableDecorbindings("render"),

    # additional decorators that don't have high priority - get added on .render() & .display()
    PreloadDecorator,

    TransitionDecorator,
    EventsDecorator,
    DraggableDecorator,
    DroppableDecorator,

    # section / child decorators. These have (almost) highest
    # priority since they should be added before the template is loaded
    SectionsDecorator
  )

  app.decorators = decor
  app.decorator = (decorator) ->
    decor.use(decorator)
