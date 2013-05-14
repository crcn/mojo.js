define ["./backbone/index"], (BackboneAdapter) ->


  

  class Adapter

    ###
    ###

    constructor: () ->
      @_adapters = [
        new BackboneAdapter()
      ]

    ###
     returns a bindable object
    ###

    getItem        : (value) -> @_get "getItem", value

    ###
     returns a bindable collection
    ###

    getCollection  : (value) -> @_get "getCollection", value

    ###
     returns a mojo view
    ###

    getView        : (value) -> @_get "getView", value

    ###
    ###

    _get: (method, value) ->
      for adapter in @_adapters
        result = adapter[method].call adapter, value
        return result if result?
      return value


    

