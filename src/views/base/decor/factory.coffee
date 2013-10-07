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
idGenerator         = require "../../../utils/idGenerator"
type = require "type-component"

_decor = (name, clazz, inheritable = true) ->
   name        : name
   clazz       : clazz
   inheritable : inheritable

###
loading order:

1. children templates
2. parent templates
3. parent -> child bindings
###

# note that the decorator order is very important
availableDecorators = [

  # bindings = priority for explicit data-bindings
  _decor("bindings"   , BindingsDecorator),
  _decor("selector"   , SelectorDecorator),
  
  # additional decorators that don't have high priority - get added on .render() & .display()
  _decor("preload"    , PreloadDecorator),

  _decor("paperclip"  , PaperclipDecorator, false),

  _decor("transition" , TransitionDecorator),
  _decor("events"     , EventsDecorator),
  _decor("draggable"  , DraggableDecorator),
  _decor("droppable"  , DroppableDecorator),
  # section / child decorators. These have (almost) highest
  # priority since they should be added before the template is loaded
  _decor("sections"   , SectionsDecorator)
]

module.exports = 

  ###
  ###

  addDecoratorClass: (options = {}) -> 

    if (type(options) is "function") or options.getOptions
      options = {
        factory: options
      }

    availableDecorators.push( 
      _decor options.name or idGenerator(), 
      options.class or options.clazz or options.factory, 
      options.inheritable
    )

  ###
  ###

  setup: (view, decor) -> 


    if decor
      _decorators = @_findDecorators decor
    else
      _decorators = view.__decorators


    # decorators are cached in the view class
    if _decorators
      @setDecorators view, _decorators
    else
      decor = @findDecorators view
      view.constructor.prototype.__decorators = view.__decorators = decor
      @setup view

  ###
   Finds ALL the decorators for a view, including the parent 
   decorators which should be inherited (but overridden by the child prototype)
  ###

  findDecorators: (view) -> 
    decorators = []

    cv = view
    pv = undefined


    # inherit from the parent classes
    while cv and cv.__isView

      # attach from the class, along with the prototype. class = optimal
      decorators = decorators.concat @_findDecorators(cv, pv).concat @_findDecorators cv.constructor, pv?.constructor
      pv = cv
      cv = cv.__super__

    used = {}

    decorators.sort((a, b) -> 
      if a.priority > b.priority then 1 else -1
    ).filter (a) ->

      unless used[a.name]
        used[a.name] = true
        return true

      used[a.name] and a.inheritable


  ###
  ###

  _findDecorators: (proto, child) ->
    decorators = []

    for d, priority in availableDecorators
      clazz       = d.clazz

      if options = clazz.getOptions proto

        #skip if the options are exactly the same
        continue if child and options is clazz.getOptions child
        decorators.push { 
          clazz       : clazz, 
          name        : d.name, 
          inheritable : d.inheritable
          options     : options, 
          priority    : priority 
        }


    decorators

  ###
  ###

  setDecorators: (view, decorators) ->
    for decor in decorators
      d = decor.clazz.decorate view, decor.options






















