define ["jquery", "events", "../models/base" , "outcome", "underscore"], ($, events, Model, outcome, _) ->

  class BaseView extends events.EventEmitter

    ###
    ###

    constructor: (options = {}) ->
      @_options = new Model options

      @_o = outcome.e @
      @init @_options

    ###
    ###

    get: () -> @_options.get.apply @_options, arguments
    set: () -> @_options.set.apply @_options, arguments
    bind: () -> @_options.bind.apply @_options, arguments

    ###
    ###

    init: (options) ->
      @template = options.template if options.template
      # OVERRIDE ME

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
      return callback null, "" if not @template
      @template.render @templateData(), callback


