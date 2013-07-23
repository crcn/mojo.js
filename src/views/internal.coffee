BindableInheritableObject = require "../bindable/inheritable"
_                         = require "underscore"
ViewCollection            = require "./collection"
generateId                = require "../utils/idGenerator"
dref                      = require "dref"
modelLocator              = require "../models/locator"
pilot                     = require "pilot-block"
ViewStates                = require "./states"
type                      = require "type-component"

  
class InternalView extends BindableInheritableObject

  ###
  ###
  
  __isView: true

  ###
  ###

  modelLocator: modelLocator

  ###
  ###

  models: modelLocator

  ###
  ###

  constructor: (data = {}) ->

    @_id = dref.get(data.model or {}, "_id") or generateId()

    data.currentState = ViewStates.NONE
    data.this = @

    super data
    @init()
    #@_init()
    #console.log "IN"


  ###
  ###

  init: () -> 
    # items to load with the view
    # TODO - viewCollections.create() - should be a recycled item
    @decorators = @loadables = new ViewCollection()
    @decorators.view = @

    # create a default element block
    @section = pilot.createSection()
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

    el = $(@section.elements.filter((node) ->
      node.nodeType == 1
    ))

    if arguments.length
      return el.find search

    return el

  ###
   attaches to an element to the DOM
  ###

  attach: (element, callback) ->
    @_domElement = element[0] or element

    @decorators.once "display", () =>
      @section.replaceChildren @_domElement

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

      # stateChange: @_init

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
    #@_init()

  _onLoaded    : () =>
    return if @_parent?.get("currentState") is ViewStates.LOADING
    @section.updateChildren()

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