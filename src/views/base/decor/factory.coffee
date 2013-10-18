BaseViewDecorator   = require "./base"
SelectorDecorator   = require "./selector"
EventsDecorator     = require "./events"
SectionsDecorator   = require "./sections/index"
DraggableDecorator  = require "./dragdrop/draggable"
DroppableDecorator  = require "./dragdrop/droppable"
TransitionDecorator = require "./transition"
PreloadDecorator    = require "./preload"


decor = require("bindable-decor")()


decor.use(

  # bindings = priority for explicit data-bindings
  require("bindable-decor-bindings")("render"),
  SelectorDecorator,

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


module.exports = decor