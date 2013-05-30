define ["jquery",
"bindable",
"./collection",
"../utils/idGenerator",
"dref",
"../models/locator",
"pilot-block",
"./states"], ($, bindable, ViewCollection, generateId, dref,  
  modelLocator, pilot, ViewStates) ->

  class InternalView extends bindable.Object

    ###
    ###
    
    __isView: true

    ###
    ###

    constructor: (data = {}) ->

      # ID's are necessary for collections
      @_id = dref.get(data, "_id") or dref.get(data.item or data.model or {}, "_id") or generateId()

      data.view         = @

      # TODO - this should be removed - leave it up to the root view
      data.modelLocator = modelLocator

      super data

      # initialize the options
      @init()

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
      @_initDecor()
      @_initBindings()


    ###
    ###

    load    : (next) -> @decorators.load next
    render  : (next) -> @decorators.render next
    display : (next) -> @decorators.display next
    remove  : (next) -> @decorators.remove next

    ###
     If the key doesn't exist, then inherit it from the parent
    ###

    get: (key) -> 

      # try to find the value in this view
      ret = super(key)

      # value doesn't exist? check the parent
      if not ret
        ret = @_parent?.get(key)

        # value exists? set to this view so we don't have to check
        # the parents anymore - also fixes any issue when setting a value
        # TODO - there should be a binding somewhere here..
        if ret
          @set key, ret
          
      ret

    ###
     bubbles up an event to the root view
    ###

    bubble: () ->
      @emit arguments...
      @_parent?.bubble arguments...

    ###
     returns a search for a particular element
     TODO - this shouldn't really exist - leave it up
     to any decorator to implement this, or place it in 
     a utility function
    ###

    $: (search) -> 
      el = $(@section.elements)

      if arguments.length
        return el.find search

      if arguments.length then el.find(search) else
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

    linkChild: () ->
      for child in arguments
        child._parent = @
      @

    ###
    ###

    dispose: () =>
      el = @$()

      # TODO - this chunk should be removed - leave it up
      # to the event decorator.
      el.unbind "*"
      @section.dispose()
      super()

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

    ###
    ###

    _initDecor: () ->
      # OVERRIDE ME

    ###
    ###

    _initBindings: () ->
      @decorators.bind("currentState").to(@, "currentState")

    ###
    ###

    _onLoad      : () =>  
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
    _onRemoved   : () =>
      return if @_parent?.get("currentState") is ViewStates.REMOVING
      @dispose()




