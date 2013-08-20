_                         = require "underscore"
generateId                = require "../../utils/idGenerator"
dref                      = require "dref"
ViewStates                = require "./states"
type                      = require "type-component"
DecorFactory              = require "./decor/factory"


class DecorableView extends require("./index")

  ###
  ###

  constructor: (data = {}) ->
    @_id = data.model?.get?("_id") ? data.model?._id ? generateId()
    data.this = @
    super data


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
  ###

  _call: (startEvent, endEvent, next) ->

    @emit startEvent
    @_onRemove()

    @callstack.push () =>
      next?()
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
    return if @_parent?.get("currentState") is ViewStates.REMOVING
    
    @section.dispose()


  ###
  ###

  _initDecor: () ->
    DecorFactory.setup @

  ###
  ###

  _onRender    : () => 
  _onRendered  : () =>

  ###
  ###
  
  _onRemove    : () =>
  _onRemoved   : () => @dispose()

  ###
   expose this so third-party modules can add a decorator
  ###

  @addDecoratorClass: DecorFactory.addDecoratorClass


module.exports = DecorableView