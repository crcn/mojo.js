define ["jquery", "events", "../models/base" , "outcome", "underscore"], ($, events, Model, outcome, _) ->

  class BaseView extends events.EventEmitter

    ###
    ###

    constructor: (options = {}) ->

      # the model consists of THIS object, along with the options provided
      @_options = new Model _.extends {}, @, options

      # outcome is flow-control for errors
      @_o = outcome.e @

      # initialize the options
      @init @_options

    ###
    ###

    get: () -> @_options.get.apply @_options, arguments
    set: () -> @_options.set.apply @_options, arguments
    bind: () -> @_options.bind.apply @_options, arguments

    ###
    ###

    init: (options) ->

      throw new Error("already initialized") if @_initialized
      @_initialized = true

      # if the template changes, re-render
      @bind "template", @rerender

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

      return callback() if not @template

      @renderTemplate @_o.e(callback).s (content) =>
        @element.html content
        callback()

    ###
     re-renders an element
    ###

    rerender: (callback = ()->) =>
      return callback() if not @selector
      @attach @selector, callback


    ###
     returns the template data
    ###

    templateData: () -> 
      @get("data") or { }

    ###
     renders the template if it exists
    ###

    renderTemplate: (callback) ->
      return callback null, "" if not @get("template")
      @get("template").render @templateData(), callback


