_            = require "underscore"
generateId   = require "../../utils/idGenerator"
type         = require "type-component"
loaf         = require "loaf"
flatstack    = require "flatstack"
bindable     = require "bindable"
Inheritable  = require "../../bindable/inheritable"
protoclass   = require "protoclass"

###
###

class DecorableView extends Inheritable

  ###
  ###

  __isView: true

  ###
  ###
  
  define: ["sections", "states"]

  ###
  ###

  constructor: (data = {}, @application) ->

    if type(data) isnt "object"
      throw new Error "data passed in view must be an object"

    super()
    
    @set data

    @models = @application?.models

    @this = @
    @_id  = data._id ? data.model?.get?("_id") ? data.model?._id ? generateId()

    @section   = loaf()
    @init()

  ###
  ###

  init: () ->
    @bind("parent").to(@_onParent).now()

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
    @call "render", "rendered", next

  ###
  ###

  remove: (next = () ->) => 
    unless @_initialized
      return next new Error "cannot remove a view that has not been rendered"

    @call "remove", "removed", next

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
  ###


  _init: (event) =>
    return if @_initialized
    @_initialized = true
    
    @emit "initialize"

    @on "render", @_onRender
    @on "rendered", @_onRendered
    @on "remove", @_onRemove
    @on "removed", @_onRemoved

    @application.decorators.decorate @

  ###
  ###

  setChild: (name, child) ->
    child.set "parent", @
    @set "sections.#{name}", child

  ###
  ###

  decorate: (options) ->
    @__decorators = undefined
    @application.decorators.decorate @, options

  ###
  ###

  dispose: () =>

    # call super - important to cleanup any listeners / bindings
    super()

    # if the parent is currently being removed, then don't bother cleaning up the 
    # element listeners, and section. 
    return if @parent and @parent.get("states.remove")
      
    @section.dispose()

    
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
  _onRemoved   : () =>  @dispose()

  ###
   listen when the parent is removed
  ###

  _onParent: (parent) =>
    @_parentDisposeListener?.dispose()
    return unless parent

    @_inherit "application"
    @_inherit "models"

    @_parentDisposeListener = parent.on "dispose", @remove


module.exports = protoclass.setup DecorableView