define ["eventemitter2"], (events) ->
  
  class EventTree

    ###
    ###

    constructor: () ->
      @_em = new events.EventEmitter2({
        wildcard: true
      })


    ###
    ###

    on: (key, callback) ->
      @_em.on @_getEvent(key), callback


    ###
    ###

    once: (key, callback) ->
      @_em.once @_getEvent(key), callback

    ##
    ##

    emit: (key, value) ->
      @_em.emit key, value

    ###
    ###

    _getEvent: (key) ->
      return "**" if not key
      return key if ~key.indexOf "*"
      return "#{key}.**"


