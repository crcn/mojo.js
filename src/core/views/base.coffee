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
    ###

    constructor: (data = {}) ->

      # ID's are necessary for collections
      @_id = dref.get(data, "_id") or dref.get(data.item or {}, "_id") or generateId()

      # create a default element block
      @section = pilot.createSection()

      data.view         = @

      # singleton modelLocator - a bit anti-patternish
      data.modelLocator = modelLocator

      super data

      # items to load with the view
      @decorators = new ViewCollection()
      @decorators.view = @

      # initialize the options
      @_init()

      ViewDecorator.setup @

    ###
    ###

    load    : (next) -> @decorators.load next
    render  : (next) -> @decorators.render next
    display : (next) -> @decorators.display next
    remove  : (next) -> @decorators.remove next

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

    get: (key) -> super(key) ? @_parent?.get(key)

    ###
    ###

    _listen: () ->
      @on 

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
     attaches to an element to the DOM
    ###

    attach: (element, callback) ->
      @_domElement = element[0] or element
      @once "display", () =>
        @section.replaceChildren @_domElement

      @display callback

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

    dispose: () ->
      el = @$()
      el.unbind "*"
      @section.dispose()
      super()


    ###
    ###

    _onLoad      : () => @_loading = true
    _onLoaded    : () =>
      @_loading = false
      return if @_parent?._loading
      @section.updateChildren()

    _onRender    : () ->
    _onRendered  : () ->

    _onDisplay   : () => 
    _onDisplayed : () => 
      @_displayed = true

    _onRemove    : () =>
      @_removing = true

    _onRemoved   : () =>
      @_removing = false
      return if @_parent?._removing
      @dispose()



