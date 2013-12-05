generateId   = require "../../utils/idGenerator"
type         = require "type-component"
loaf         = require "loaf"
Inheritable  = require "../../bindable/inheritable"
protoclass   = require "protoclass"
Janitor      = require "janitorjs"


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

    # data must be an object - setting to this view
    if type(data) isnt "object"
      throw new Error "data passed in view must be an object"

    # pass data to super - will get set to this view controller
    super()

    # have reference back to this view controller - useful for templates
    @this = @

    # must have an ID
    # TODO - should not be familiar with models
    @_id  = data._id ? data.model?.get?("_id") ? data.model?._id ? generateId()

    # make sure this view is resettable so that reset() doesn't throw an error
    @_fresh = true

    # initialize - keeps sub-classes from calling constructor
    @initialize()

    # another initialization method - used
    # particularly for object recycling
    @reset data

  ###
  ###

  initialize: () ->
    # OVERRIDE ME

  ###
   resets the view - this should be called only after disposing
  ###

  reset: (data = {}) ->

    # make sure that reset() is only called after the view
    # is resettable - this is a bit of a helper incase reset() is called more than
    # it should
    unless @_fresh
      throw new Error "can only reset a view that has has been disposed"


    @_fresh = false

    # set the data passed by the constructor, or recycler
    @set data

    # at this point, bindings have been disposed of, so re-add then
    @bind("application").to(@_onApplication).now()
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

  render: () =>

    # cannot re-render
    return @section if @_rendered
    @_rendered = true

    # incase remove() has been called
    if @_fresh
      @reset()

      # add additional functionality to this view
      @application.decorators.decorate @

    # emit render - this triggers any 
    # decorator
    @emit "render"

    @section

  ###
  ###

  remove: () => 

    # only emit remove if rendered
    if @_rendered
      @_rendered = false
      @emit "remove"
      @section = 

  ###
   returns a search for a particular element
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

  attach: (element) ->
    (element[0] or element).appendChild @render().toFragment()

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
    @

  ###
  ###

  dispose: () =>

    @_fresh = true

    # call super - important to cleanup any listeners / bindings
    super()

    # return if the parent has NOT been rendered, or has been 
    # removed - it's redundant to dispose the section 
    return unless @parent?._rendered 
      
    @section.dispose()

  ###
   bubbles up an event to the root object
  ###

  bubble: () ->
    @emit arguments...
    @parent?.bubble arguments...

  ###
   listen when the parent is removed
  ###

  _onParent: (parent) =>
    @_parentDisposeListener?.dispose()
    return unless parent

    @_inherit "application"

    # dispose THIS child if the parent has been disposed of
    @_parentDisposeListener = parent.on "dispose", @remove

  ###
  ###

  _onApplication: (application) =>
    @_resetSection()
    @models    = application.models


  ###
  ###

  _resetSection: () ->
    @section?.dispose()
    @section = loaf @application.nodeFactory


module.exports = protoclass.setup DecorableView