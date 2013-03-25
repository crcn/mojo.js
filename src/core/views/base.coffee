define ["jquery", 
"events", 
"bindable",
"../utils/idGenerator",
"outcome", 
"dref",
"underscore", 
"./decor/facade",
"asyngleton", 
"../models/locator",
"../utils/async"], ($, events, bindable, generateId, outcome, dref, _, 
  ViewDecorator, asyngleton, modelLocator, async) ->
  
  class BaseView extends bindable.Object

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
      options._id = dref.get(options, "_id") or generateId()

      super options

      # controls bindings, events, templates, transitions based on the given options.
      @decorator = new ViewDecorator @

      # items to load with the view
      @loadables = new bindable.Collection([@decorator])

      # outcome is flow-control for errors
      @_o = outcome.e @

      # initialize the options
      @_init()
      @decorator.init()

    ###
     visible is a nice toggle which handles events / bindings - and other things
    ###

    visible: () ->
      # TODO

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
      @on 
        html: @_onHTML
        attached: @_onAttached
        removed: @_onRemoved
        change: @_onChanged
        loaded: @_onLoaded

    ###
     returns a search for a particular element
    ###

    $: (search) -> 

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

    html: (content) ->
      @element.html content
      @emit "html", content

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

    _onHTML      : () ->
    _onAttached  : () ->
    _onRemoved   : () ->
    _onChanged   : () ->
    _onLoaded    : () ->



