define ["jquery", "events", "outcome"], ($, events, outcome) ->

  class BaseView extends events.EventEmitter

    ###
    ###

    constructor: (@options = {}) ->
      @_o = outcome.e @


    ###
     returns a search for a particular element
    ###

    $: (search) -> $.find search

    ###
     attaches to an element
    ###

    attach: (selectorOrElement, callback = (() ->)) ->

      @element  = if typeof selectorOrElement is "string" then $(selectorOrElement) else selectorOrElement
      @selector = selectorOrElement

      @renderTemplate @_o.e(callback).s (content) =>
        @element.html content
        callback

    ###
     re-renders an element
    ###

    rerender: (callback = ()->) =>
      return callback() if not @selector
      @attach @selector, callback


    ###
     returns the template data
    ###

    templateData: () -> @options.data or { }

    ###
     renders the template if it exists
    ###

    renderTemplate: (callback) ->
      return callback null, "" if not @options.template
      @options.template.render @templateData(), callback


