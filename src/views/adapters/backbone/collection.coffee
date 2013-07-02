bindable = require "bindable"
BackboneWrapperModel = require "./model"
hoist = require "hoist"
asyngleton = require "asyngleton"


class BackboneWrapperCollection extends bindable.Collection

  ###
  ###

  constructor: (@_backboneCollection) -> 
    super()


    for event in ["replace", "reset", "add", "remove"]
      _backboneCollection.bind event , @["__#{event}"], @

    @_setupTransformers()

  ###
  ###

  bind: () ->
    @fetch()
    super arguments...

  ###
  ###

  fetch: asyngleton (next) -> 
    @_backboneCollection.fetch()
    @once "__reset", next

  ###
  ###

  _setupTransformers: () ->
    @transform().map hoist().cast BackboneWrapperModel

  ###
  ###

  __replace: () -> # TODO

  ###
  ###

  __reset: (collection) ->
    @reset collection.models
    @emit "__reset"

  ###
  ###

  __add: () -> # TODO

  ###
  ###

  __remove: () -> # TODO

module.exports = BackboneWrapperCollection
