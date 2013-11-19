
###
 Resource manager

 janitor = new Janitor()

 janitor.addTimeout(setTimeout(fn, 10))
 janitor.add({
  dispose: () ->
 })

 janitor.dispose() # dispose everything
###

type = require "type-component"

class Janitor

  ###
  ###

  constructor: () ->
    @_garbage = []

  ###
  ###

  add: (disposable) ->

    if disposable.dispose
      @_garbage.push disposable
    else if type(disposable) is "function"
      @_garbage.push {
        dispose: disposeable
      }

  ###
  ###

  addTimeout: (timeout) ->
    @add {
      dispose: () -> clearTimeout timeout
    }

  ###
  ###

  addInterval: (interval) ->
    @add {
      dispose: () -> clearInterval interval
    }

  ###
  ###

  dispose: () ->

    for disposable in @_garbage
      disposable.dispose()

    @_garbage = []


module.exports = Janitor