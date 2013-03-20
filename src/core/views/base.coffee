define ["jquery", "events", "../bindings/bindable", "outcome", "underscore", "./decor/facade", "asyngleton", "../collections/concrete", "../utils/async", "structr"], ($, events, Bindable, outcome, _, ViewDecorator, asyngleton, Collection, async, structr) ->


  class BaseView extends Bindable

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
      @init()

      # after init, set to initialized
      @set "initialized", true


    ###
    ###

    init: () ->

      throw new Error("already initialized") if @_initialized
      @_initialized = true  

      # on added to the stage
      @on "attached", @_onAttached

      # on removed from the stage
      @on "removed", @_onRemoved

      # on data change
      @on "change", @_onChanged

      # all additional bindings should go here
      @once "loaded", @_onLoaded

    ###
     returns a search for a particular element
    ###

    $: (search) -> @element?.find search

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

    structr BaseView



