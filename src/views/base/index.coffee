_            = require "underscore"
generateId   = require "../../utils/idGenerator"
dref         = require "dref"
type         = require "type-component"
DecorFactory = require "./decor/factory"
loaf         = require "loaf"
flatstack    = require "flatstack"
models       = require "../../models"
bindable     = require "bindable"
Inheritable  = require "../../bindable/inheritable"
structr      = require "structr"    



class DecorableView extends Inheritable
  
  ###
  ###

  __isView: true

  ###
  ###
  
  define: ["sections"]

  ###
  ###

  models: models

  ###
  ###

  constructor: (data = {}) ->

    if type(data) isnt "object"
      throw new Error "data passed in view must be an object"

    super()
    
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
      cp = cp.parent

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

  _call: (startEvent, endEvent, next) ->

    # cover any case where next might not be a function. This might
    # happen when an async function does something like - model.load @view.render
    if type(next) isnt "function"
      next = () ->
      
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
    @__decorators = undefined
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
    @bind("parent").to(@_onParent).now()

    DecorFactory.setup @

  ###
  ###

  dispose: () =>

    # call super - important to cleanup any listeners / bindings
    super()

    # if the parent is currently being removed, then don't bother cleaning up the 
    # element listeners, and section. 
    return if @parent and @parent._states.remove
    
    @section.dispose()

  ###
  ###

  setChild: (name, child) ->
    child.name = name

    # deprecated
    child.set "_parent", @
    child.set "parent", @
    @set "sections.#{name}", child
    @emit "child", child

    
  ###
   bubbles up an event to the root object
  ###

  bubble: () ->
    @emit arguments...
    @parent?.bubble arguments...

  ###
  ###

  _onRender    : () => 
  _onRendered  : () =>

  ###
  ###
  
  _onRemove    : () =>
  _onRemoved   : () => 
    @dispose()

  ###
   listen when the parent is removed
  ###

  _onParent: (parent) =>
    @_parentDisposeListener?.dispose()
    return unless parent
    @_parentDisposeListener = parent.on "dispose", @remove

  ###
   expose this so third-party modules can add a decorator
  ###

  @addDecoratorClass: DecorFactory.addDecoratorClass


  ###
  ###

  @extend: (proto) ->
    clazz = structr @, proto
    clazz





module.exports = DecorableView