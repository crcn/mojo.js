define ["jquery", "events", "../models/base" , "outcome", "underscore", "../utils/compose", "./decor/facade"], ($, events, Model, outcome, _, compose, ViewDecorator) ->

  class BaseView extends events.EventEmitter

    ###
    ###

    constructor: (options = {}) ->

      # the model consists of THIS object, along with the options provided
      @options   = new Model _.extend {}, options, @
      compose @, @options, ["get", "has", "set", "bind", "glue"]

      @decorator = new ViewDecorator @

      # outcome is flow-control for errors
      @_o = outcome.e @


      # initialize the options
      @init @options

      # after init, set to initialized
      @options.set "initialized", true


    ###
    ###

    init: (options) ->

      options.set "data.view", @

      throw new Error("already initialized") if @_initialized
      @_initialized = true

      # options.bind "data", @

    ###
     returns a search for a particular element
    ###

    $: (search) -> @element?.find search

    ###
     attaches to an element
    ###

    attach: (selectorOrElement, callback = (() ->)) ->

      # remove incase it's been added elsewhere
      @remove()

      @element  = if typeof selectorOrElement is "string" then $(selectorOrElement) else selectorOrElement
      @selector = selectorOrElement

      @decorator.setup @_o.e(callback).s () =>
        callback()
        @_attached()


    ###
     re-renders an element
    ###

    rerender: (callback = ()->) =>
      if typeof callback isnt "function"
        callback = (() ->)
      return callback() if not @selector
      @attach @selector, callback


    ###
    ###

    _attached: () ->
      # OVERRIDE ME


    ###
    ###

    remove: (callback = (() ->)) ->
      return callback() if not @element
      @decorator.teardown @_o.e(callback).s () =>
        @element.unbind("*")
        @element.html("")
        callback()


