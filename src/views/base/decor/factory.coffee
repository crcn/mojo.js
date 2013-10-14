BaseViewDecorator   = require "./base"
SelectorDecorator   = require "./selector"
PaperclipDecorator  = require "./paperclip"
EventsDecorator     = require "./events"
BindingsDecorator   = require "./bindings"
SectionsDecorator   = require "./sections/index"
DraggableDecorator  = require "./dragdrop/draggable"
DroppableDecorator  = require "./dragdrop/droppable"
TransitionDecorator = require "./transition"
PreloadDecorator    = require "./preload"


decor = require("bindable-decor")()


decor.use(

  # bindings = priority for explicit data-bindings
  BindingsDecorator,
  SelectorDecorator,

  # additional decorators that don't have high priority - get added on .render() & .display()
  PreloadDecorator,

  { decorator: PaperclipDecorator, inheritable: false },

  TransitionDecorator,
  EventsDecorator,
  DraggableDecorator,
  DroppableDecorator,
  # section / child decorators. These have (almost) highest
  # priority since they should be added before the template is loaded
  SectionsDecorator
)


module.exports = decor