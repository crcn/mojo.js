define ["jquery", 
"events", 
"bindable",
"./collection",
"../utils/idGenerator",
"outcome", 
"dref",
"underscore", 
"./decor/facade",
"asyngleton", 
"../models/locator",
"../utils/compose",
"../utils/async", 
"pilot-block",
"toarray"], ($, events, bindable, ViewCollection, generateId, outcome, dref, _, 
  ViewDecorator, asyngleton, modelLocator, compose, async, pilot, toarray) ->
    


  class BaseView extends bindable.Object

    ###
     may seem a bit antipattern-ish to use a singleton object like this for all views, bit 
     it makes data-binding to one object a helluvalot easier, and it also promotes good use by making it
     easier for developer to reuse global data. 

     This also reduces the amount of written code tremendously.
    ###

    constructor: (options = {}) ->

      @_id = dref.get(options, "_id") or dref.get(options.item or {}, "_id") or generateId()

      # create a default element block
      @section = pilot.createSection()

      options = _.extend {}, @data or {}, options

      options.view = @
      options.modelLocator = modelLocator

      super options

      # controls bindings, events, templates, transitions based on the given options.
      @decorator = new ViewDecorator @

      # inherit from the parent prototype
      #@_inheritDecorators()

      # items to load with the view
      @loadables = new ViewCollection [@decorator]
      @loadables.view = @

      compose @, @loadables, ["load", "render", "display", "remove"]

      # initialize the options
      @_init()
      @decorator.init()

    ###
    ###

    init: () ->

      # OVERRIDE ME

    ###
    ###

    _init: () ->
      @init()
      @_listen()

    ###
     If the key doesn't exist, then inherit it from the parent
    ###

    get: (key) ->

      # if the value doesn't exist, then inherit it from the parent
      return super(key) ? @_parent?.get(key)

    ###
    ###

    _listen: () ->

      @loadables.on 

        # emitted before load
        load: @_onLoad

        # emitted after all the children have been loaded
        loaded: @_onLoaded

        # emitted before render
        render: @_onRender

        # emitted after all children have been attached - before transitions & events
        rendered: @_onRendered

        # emitted before display
        display: @_onDisplay,

        # emitted after this view has been attached to an element - after transitions & events
        displayed: @_onDisplayed,

        # emitted before remove
        remove: @_onRemove,

        # emitted after this view has been completely removed
        removed: @_onRemoved

    ###
     returns a search for a particular element
    ###

    $: (search) -> 
      el = $(@section.elements)

      if arguments.length
        return el.find search

      return el

    ###
     attaches to an element
    ###

    attach: (element, callback) ->
      @_domElement = element[0] or element
      @loadables.display callback

    ###
    ###

    linkChild: () ->
      for child in arguments
        child._parent = @
      @

    ###
    ###

    emit: () ->
      super arguments...

      arguments[0] = arguments[0].toLowerCase()

      # also send it to the element
      el = @$()
      el.trigger.apply el, arguments

    ###
    ###

    _onLoad      : () =>
    _onLoaded    : () =>

    _onRender    : () =>
    _onRendered  : () => 

    _onDisplay   : () =>
      return if not @_domElement
      @section.replaceChildren @_domElement

    _onDisplayed : () => 
      @_displayed = true

    _onRemove    : () =>
      @_removing = true

    _onRemoved   : () =>
      return if @_parent?._removing
      @section.dispose()

      el = @$()
      el.unbind("*")
      el.remove()

      @dispose()
      @el = undefined



