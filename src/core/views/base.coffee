define ["jquery", 
"events", 
"bindable",
"outcome", 
"underscore", 
"./decor/facade",
"asyngleton", 
"../collections/concrete", 
"../models/locator",
"../utils/async"], ($, events, Bindable, outcome, _, 
  ViewDecorator, asyngleton, 
  Collection, modelLocator, async) ->
  
  class BaseView extends Bindable

    ###
     may seem a bit antipattern-ish to use a singleton object like this for all views, bit 
     it makes data-binding to one object a helluvalot easier, and it also promotes good use by making it
     easier for developer to reuse global data. 

     This also reduces the amount of written code tremendously.
    ###

    modelLocator: modelLocator

    ###
    ###

    constructor: (options = {}) ->

      options.view = @

      super options

      # controls bindings, events, templates, transitions based on the given options.
      @decorator = new ViewDecorator @

      # items to load with the view
      @loadables = new Collection([@decorator])

      # outcome is flow-control for errors
      @_o = outcome.e @

      # initialize the options
      @_init()

      # after init, set to initialized
      @set "initialized", true


    ###
    ###

    init: () ->
      # OVERRIDE ME


    ###
    ###

    _init: () ->
      throw new Error("already initialized") if @get("initialized")
      @init()
      @_listen()


    ###
    ###

    _listen: () ->
      @on 
        attached: @_onAttached
        removed: @_onRemoved
        change: @_onChanged
        loaded: @_onLoaded

    ###
     returns a search for a particular element
    ###

    $: (search) -> 

      # is it an ID? There should only be one item, so search to the global context
      return $(search) if search.substr(0, 1) is "#"

      # otherwise - only look within this element
      @element?.find search

    ###
     attaches to an element
    ###

    attach: (selectorOrElement, callback = (() ->)) ->

      @element  = if typeof selectorOrElement is "string" then $(selectorOrElement) else selectorOrElement
      @selector = selectorOrElement

      @load () =>   
        @decorator.attach @_o.e(callback).s () =>
          callback()
          @emit "attached"


    ###
     re-renders an element
    ###

    rerender: (callback = ()->) =>

      callback = @_fixCallback callback

      return callback() if not @selector
      @attach @selector, callback


    ###
    ###

    remove: (callback = (() ->)) ->

      callback = @_fixCallback callback

      return callback() if not @element
      @decorator.remove @_o.e(callback).s () =>
        @element.unbind("*")
        @element.html("")
        callback()
        @emit "removed"

    ###
    ###

    load: asyngleton (callback) -> 
      async.eachSeries @loadables.source(), ((loadable, next) ->
        loadable.load next
      ), @_o.e(callback).s () =>
        callback()
        @emit "loaded"


    ###
     Fixes the callback incase it's not a function
    ###

    _fixCallback: (callback) ->

      if typeof callback isnt "function"
        callback = (() ->)

      callback


    ###
    ###

    _onAttached: () ->
    _onRemoved: () ->
    _onChanged: () ->
    _onLoaded: () ->



