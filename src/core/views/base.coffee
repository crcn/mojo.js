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
"../utils/async"], ($, events, bindable, ViewCollection, generateId, outcome, dref, _, 
  ViewDecorator, asyngleton, modelLocator, compose, async) ->
  
  class BaseView extends bindable.Object

    ###
     may seem a bit antipattern-ish to use a singleton object like this for all views, bit 
     it makes data-binding to one object a helluvalot easier, and it also promotes good use by making it
     easier for developer to reuse global data. 

     This also reduces the amount of written code tremendously.
    ###

    constructor: (options = {}) ->

      @_id = dref.get(options, "_id") or generateId()

      options.view = @
      options.modelLocator = modelLocator

      super options

      # controls bindings, events, templates, transitions based on the given options.
      @decorator = new ViewDecorator @

      # items to load with the view
      @loadables = new ViewCollection [@decorator]

      compose @, @loadables, ["load", "render", "display", "remove"]

      # outcome is flow-control for errors
      @_o = outcome.e @

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
    
      # otherwise - only look within this element
      @el?.find search

    ###
     attaches to an element
    ###

    attach: (selectorOrElement, callback) ->
      @element selectorOrElement
      @loadables.display callback

    ###
    ###

    element: (selectorOrElement) ->
      return @el if not arguments.length
      @el  = if typeof selectorOrElement is "string" then $(selectorOrElement) else selectorOrElement
      @selector = selectorOrElement
      @


    ###
    ###

    emit: () ->
      super arguments...

      arguments[0] = arguments[0].toLowerCase()

      # also send it to the element
      @el?.trigger.apply @el, arguments


    ###
    ###

    _onLoad      : () =>
    _onLoaded    : () =>

    _onRender    : () =>
    _onRendered  : () => 

    _onDisplay   : () =>
    _onDisplayed : () => 

    _onRemove    : () =>
    _onRemoved   : () =>
      return if not @el
      @el.unbind("*")
      @el.html("")
      @dispose()
      @el = undefined



