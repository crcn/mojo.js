define ["jquery", "dref", "events", "../models/base", "../bindings/bindable", "outcome", "underscore", "../utils/compose", "./decor/facade"], ($, dref, events, Bindable, outcome, _, compose, ViewDecorator) ->



  class BaseView extends Bindable

    ###
    ###

    constructor: (options = {}) ->

      super options

      @decorator = new ViewDecorator @

      # outcome is flow-control for errors
      @_o = outcome.e @

      # initialize the options
      @init()

      # after init, set to initialized
      @set "initialized", true


    ###
     override key so the view data can be fetched as well. Makes it a bit easier extending
     a view class.
    ###

    get: (key) ->
      return super(key) or @_ref @, key

    ###
    ###

    init: () ->

      @set "data.view", @

      throw new Error("already initialized") if @_initialized
      @_initialized = true

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

      @decorator.setup @_o.e(callback).s () =>
        callback()
        @_attached()
        rivets.bind @element, { data: @ }


    ###
     re-renders an element
    ###

    rerender: (callback = ()->) =>

      callback = @_fixCallback callback

      return callback() if not @selector
      @attach @selector, callback


    ###
    ###

    _attached: () ->
      # OVERRIDE ME


    ###
    ###

    remove: (callback = (() ->)) ->

      callback = @_fixCallback callback

      return callback() if not @element
      @decorator.teardown @_o.e(callback).s () =>
        @element.unbind("*")
        @element.html("")
        callback()
        @emit "removed"


    ###
     Fixes the callback incase it's not a function
    ###

    _fixCallback: (callback) ->

      if typeof callback isnt "function"
        callback = (() ->)

      callback


