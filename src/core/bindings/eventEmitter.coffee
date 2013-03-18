define ["disposable", "eventemitter2"], (disposable, events) ->
  
  class EventEmitter extends events.EventEmitter2

    ###
    ###

    constructor: () ->
      super {
        wildcard: true
      }

    ###
    ###

    on: (key, listener) ->

      disposables = disposable.create()

      # ability to have multiple listeners as key
      if arguments.length is 0
        listeners = key
        for k of listeners 
          disposables.add @on k, listeners[k]
        disposables


      # ability to specify multiple keys for a given listener
      key.split(" ").forEach (key) =>
        super key, listener

        disposables.add () =>
          @off key, listener
        
      disposables