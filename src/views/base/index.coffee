_                         = require "underscore"
generateId                = require "../../utils/idGenerator"
dref                      = require "dref"
type                      = require "type-component"
DecorFactory              = require "./decor/factory"
loaf                      = require "loaf"
flatstack                 = require "flatstack"
models                    = require "../../models"
bindable                  = require "bindable"


class DecorableView extends bindable.Object

  __isView: true

  ###
  ###

  models: models

  ###
  ###

  constructor: (data = {}) ->

    if type(data) isnt "object"
      throw new Error "data passed in view must be an object"

    super @
    @set data

    @this = @
    @_id  = data._id ? data.model?.get?("_id") ? data.model?._id ? generateId()

    @_states = {}

    @section   = loaf()
    @callstack = flatstack()


    @init()

  ###
  ###

  init: () ->

  ###
   returns path to this view. Useful for debugging.
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

  render: (next) =>
    @_init()
    @_call "render", "rendered", next

  ###
  ###

  remove: (next) => 
    @_call "remove", "removed", next

  ###
   memoize call fn
  ###

  _call: (startEvent, endEvent, next = () ->) ->

    return next() if @_states[endEvent]

    @once endEvent, next

    return if @_states[startEvent]
    @_states[startEvent] = true

    @emit startEvent
    @_onRemove()

    @callstack.push () =>
      @_states[endEvent] = true
      @emit endEvent

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

  attach: (element, next) ->

    @render () =>
      (element[0] or element).appendChild @section.toFragment()
      next?()


  ###
   dynamically added decorators
  ###

  decorate: (options) ->  
    DecorFactory.setup @, options

  ###
  ###

  _init: (event) =>
    return if @_initialized
    @_initialized = true
    
    @emit "initialize"

    @on "render", @_onRender
    @on "rendered", @_onRendered
    @on "remove", @_onRemove
    @on "removed", @_onRemoved
    DecorFactory.setup @

  ###
  ###

  dispose: () =>

    # call super - important to cleanup any listeners / bindings
    super()

    # if the parent is currently being removed, then don't bother cleaning up the 
    # element listeners, and section. 
    return if @_parent and @_parent._states.remove and not @_parent._states.removed
    
    @section.dispose()

  ###
  ###

  linkChild: () ->
    for child in arguments
      child._parent = @
    @
    
  ###
   bubbles up an event to the root object
  ###

  bubble: () ->
    @emit arguments...
    @_parent?.bubble arguments...

  ###
  ###

  _onRender    : () => 
  _onRendered  : () =>
    @_rendered = true

  ###
  ###
  
  _onRemove    : () =>
  _onRemoved   : () => 
    @_removed = true
    @dispose()

  ###
   expose this so third-party modules can add a decorator
  ###

  @addDecoratorClass: DecorFactory.addDecoratorClass


module.exports = DecorableView