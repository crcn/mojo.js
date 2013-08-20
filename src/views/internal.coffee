BindableInheritableObject = require "../bindable/inheritable"
_                         = require "underscore"
ViewCollection            = require "./collection"
generateId                = require "../utils/idGenerator"
dref                      = require "dref"
models                    = require "../models"
loaf                     = require "loaf"
ViewStates                = require "./states"
type                      = require "type-component"

  
class InternalView extends BindableInheritableObject

  ###
  ###
  
  __isView: true

  ###
  ###

  modelLocator: models

  ###
  ###

  models: models

  ###
  ###

  constructor: (data = {}) ->

    @_id = data.model?.get?("_id") ? data.model?._id ? generateId()

    data.currentState = ViewStates.NONE
    data.this = @

    super data
    @init()

  ###
  ###

  init: () -> 
    # items to load with the view
    # TODO - viewCollections.create() - should be a recycled item
    @decorators = @loadables = new ViewCollection()
    @decorators.view = @

    # create a default element block
    @section = loaf()
    @_initListeners()

  ###
   returns path to this view
  ###

  path: () ->
    path = []
    cp = @
    while cp
      path.unshift cp.constructor.name
      cp = cp._parent

    path.join "."

  ###
  ###

  load    : (next) -> @decorators.load next
  render  : (next) -> @decorators.render next
  display : (next) -> @decorators.display next
  remove  : (next) -> @decorators.remove next

  ###
   returns a search for a particular element
   TODO - this shouldn't really exist - leave it up
   to any decorator to implement this, or place it in 
   a utility function
  ###

  $: (search) -> 

    # a little overhead, but we need to re-scan the elements
    # each time $() is called
    el = $ @section.getChildNodes()

    if arguments.length
      return el.find search

    return el

  ###
   attaches to an element to the DOM
  ###

  attach: (element, callback) ->
    @_domElement = element[0] or element

    @decorators.once "display", () =>
      @_domElement.appendChild @section.toFragment()

    @display callback

  ###
  ###

  _init: (event) =>
    return if @_initialized
    @_initialized = true
    @_initDecor()
    @_initBindings()

  ###
  ###

  dispose: () =>

    # call super - important to cleanup any listeners / bindings
    super()

    # if the parent is currently being removed, then don't bother cleaning up the 
    # element listeners, and section. 
    return if @_parent?.get("currentState") is ViewStates.REMOVING
    el = @$()

    # TODO - this chunk should be removed - leave it up
    # to the event decorator.
    el.unbind "*"
    @section.dispose()

  ###
  ###

  _initListeners: () ->
    @decorators.on 
      load      : @_onLoad
      loaded    : @_onLoaded

      render    : @_onRender
      rendered  : @_onRendered

      display   : @_onDisplay
      displayed : @_onDisplayed

      remove    : @_onRemove 
      removed   : @_onRemoved

    @decorators.once "stateChange", @_init

  ###
  ###

  _initDecor: () ->

  ###
  ###

  _initBindings: () ->
    @decorators.bind("currentState").to(@, "currentState").now()

  ###
  ###

  _onLoad      : () =>
  _onLoaded    : () =>

  ###
  ###

  _onRender    : () => 
  _onRendered  : () =>

  ###
  ###

  _onDisplay   : () => 
  _onDisplayed : () => 

  ###
  ###
  
  _onRemove    : () =>
  _onRemoved   : () => @dispose()


module.exports = InternalView