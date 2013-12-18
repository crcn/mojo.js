generateId   = require "../../utils/idGenerator"
type         = require "type-component"
loaf         = require "loaf"
subindable   = require "subindable"
protoclass   = require "protoclass"
janitor      = require "janitorjs"

###
###

class DecorableView extends subindable.Object

  ###
  ###

  __isView: true

  ###
  ###
  
  define: ["sections", "states"]

  ###
  ###


  constructor: (data, @application) ->

    # pass data to super - will get set to this view controller
    super @

    # have reference back to this view controller - useful for templates
    @this = @
    
    # must have an ID
    # TODO - should not be familiar with models
    if data
      @_id  = data._id ? data.model?.get?("_id") ? data.model?._id ? generateId()
    else
      @_id = generateId()

    # initialize - keeps sub-classes from calling constructor
    @initialize data

  ###
  ###

  disposable: (disposable) ->
    unless @_janitor
      @_janitor = janitor()
    @_janitor.add(disposable)


  ###
  ###

  initialize: (data) ->

    # set the data passed by the constructor, or recycler
    if data
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


    @_render @section


    unless @_decorated
      @_decorated = true
      # add additional functionality to this view
      @application.decorators.decorate @, @constructor.prototype

    # emit render - this triggers any 
    # decorator
    @emit "render"

    @section

  ###
  ###

  _render: (section) ->
    # OVERRIDE ME

  ###
   removes the section
  ###

  remove: () => 

    # only emit remove if rendered
    if @_rendered
      @_rendered = false
      @emit "remove"
      if not @parent or @parent._rendered
        @section.removeAll()

  ###
   returns a search for a particular element
  ###

  $: (search) -> 

    # a little overhead, but we need to re-scan the elements
    # each time $() is called
    # might not be rendered, so check for section
    el = $ @section?.getChildNodes()

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

    child.once "dispose", () =>
      @set "sections.#{name}", undefined

  ###
  ###

  decorate: (options) ->
    @application.decorators.decorate @, options
    @

  ###
   destroys this view completely - does cleanup
   of all listeners
  ###

  dispose: () =>

    @remove()

    @_janitor?.dispose()

    # listeners are getting disposed - 
    @_decorated = false

    @set "parent", undefined

    super()


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
    @_parentRemoveListener?.dispose()
    @_parentDisposeListener?.dispose()
    return unless parent

    @inherit "application"

    # dispose THIS child if the parent has been disposed of
    @_parentRemoveListener  = parent.on "remove", @remove
    @_parentDisposeListener = parent.on "dispose", @dispose

  ###
  ###

  _onApplication: (application) =>
    @section = loaf application.nodeFactory
    @set "models", application.models


module.exports = protoclass.setup DecorableView