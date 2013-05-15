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

    constructor: (data = {}) ->

      # ID's are necessary for collections
      @_id = dref.get(data, "_id") or dref.get(data.item or {}, "_id") or generateId()

      data.view         = @
      data.modelLocator = modelLocator

      super data


      # items to load with the view
      # TODO - viewCollections.create() - should be a recycled item
      @decorators = @loadables = new ViewCollection()
      @decorators.view = @

      # create a default element block
      @section = pilot.createSection()

      # initialize the options
      @init()
      @_listen()

    ###
    ###

    init: () -> # OVERRIDE ME

    ###
    ###

    load    : (next) -> @decorators.load next
    render  : (next) -> @decorators.render next
    display : (next) -> @decorators.display next
    remove  : (next) -> @decorators.remove next


    ###
     If the key doesn't exist, then inherit it from the parent
    ###

    get: (key) -> super(key) ? @_parent?.get(key)

    ###
    ###

    bubble: () ->
      @emit arguments...
      @_parent?.bubble arguments...

    ###
     returns a search for a particular element
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
      el.unbind "*"
      @section.dispose()
      super()

    ###
    ###

    _listen: () ->
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

    _onLoad      : () => @currentState = ViewStates.LOADING
    _onLoaded    : () =>
      return if @_parent?.currentState is ViewStates.LOADING
      @section.updateChildren()

    ###
    ###

    _onRender    : () => @currentState = ViewStates.RENDERING
    _onRendered  : () =>

    ###
    ###

    _onDisplay   : () => @currentState = ViewStates.DISPLAYING
    _onDisplayed : () => 

    ###
    ###
    
    _onRemove    : () => @currentState = ViewStates.REMOVING
    _onRemoved   : () =>
      return if @_parent?.currentState is ViewStates.REMOVING
      @dispose()




