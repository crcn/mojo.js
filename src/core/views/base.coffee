define ["jquery", "events", "../models/base" , "outcome", "underscore"], ($, events, Model, outcome, _) ->

  class BaseView extends events.EventEmitter

    ###
    ###

    constructor: (options = {}) ->

      # the model consists of THIS object, along with the options provided
      @_options = new Model _.extend {}, options, @

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

      complete = () =>
        callback()
        @_attached()


      @element  = if typeof selectorOrElement is "string" then $(selectorOrElement) else selectorOrElement
      @selector = selectorOrElement


      return complete() if not @get("template")

      @renderTemplate @_o.e(callback).s (content) =>

        @element.html content
        complete()

    ###
     re-renders an element
    ###

    rerender: (callback = ()->) =>
      console.log callback
      return callback() if not @selector
      @attach @selector, callback


    ###
    ###

    _attached: () ->
      # OVERRIDE ME


    ###
     returns the template data
    ###

    templateData: () -> @get()

    ###
     renders the template if it exists
    ###

    renderTemplate: (callback) ->
      return callback null, "" if not @get("template")
      @get("template").render @templateData(), callback


    ###
    ###

    remove: (callback = (() ->)) ->
      return callback() if not @element
      @element.unbind("*")
      @element.html("")
      callback()


