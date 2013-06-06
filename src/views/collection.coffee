
define ["bindable", "flatstack"], (bindable, flatstack) ->
    
  class DecorCollection extends bindable.Collection

    ###
    ###

    constructor: () ->
      super arguments...

      @enforceId false

      # used as a flow-control library that minimizes
      # the amount of recursion 
      @_callstack = flatstack @

      # keep tabs on any late decorators
      @on "insert", @_loadLateDecor

      @_running = {}

    ###
     Creates, and parses the DOM
    ###

    load: (callback) -> 
      @_runOnce "load", callback, (callback) =>
        @_call "load", "loaded", @source(), callback

    ###
     attaches any controllers / bindings to the view (rivets)
    ###

    render: asyngleton (callback) ->
      @_runOnce "render", callback, (callback) => @load () =>
        @_call "render", "rendered", @source(), callback

    ###
     adds the elements to the DOM - transitions happen here
    ###

    display: asyngleton (callback) -> 
      @_runOnce "display", callback, (callback) => @render () =>
        @_call "display", "displayed", @source(), callback

    ###
     removes & unloads the view
    ###

    remove: asyngleton (callback) ->
      @_runOnce "remove", callback, (callback) => @display () =>
        @_call "remove", "removed", @source(), callback

    ###
    ###

    emit: () ->
      super arguments...
      @view?.emit arguments...

    ###
    ###

    _call: (method, event, source, callback = (() ->)) ->

      # first time being called? It's NOW the current state
      if @get("currentState") isnt method
        @set "currentState", method
        @emit method

      # once all decorators have been loaded, make sure to load all pending
      # decor before continuing. This is recursive until these are NO MORE pending
      # decorators!
      done = () => 
        @_callPending method, event, callback

      # source is copied incase any *new* items are added - new items can be pushed / unshifted, which
      # can screw up the loading process. _callPending is used to capture any decorators that might
      # have been added a bit late.
      src = source.concat().map (decor) => 
        fn      : decor[method] or @_noFn 
        context : decor 
      
      @_callstack.push.apply @_callstack, src
      @_callstack.push done

    ###
    ###

    _noFn: () ->

    ###
     calls any late decorators
    ###

    _callPending: (method, event, callback) ->


      # no pending decorators? We're finished here
      unless @_pending

        #load, loaded, display, displayed, etc.
        @set event, true

        @emit event
        callback()
        return

      pending   = @_pending
      @_pending = undefined


      @_call method, event, pending, callback

    ###
     used when a decorator is added a bit late - might happen
     for items such as states, lists, or dynamically loaded decor (child views)
    ###

    _loadLateDecor: (decorator) => 

      # hasn't even started yet!
      return unless @has("currentState") or @get("currentState") is "none"

      # already done? display the decorator
      if @get("displayed")
        decorator.display?()
        return

      unless @_pending
        @_pending = []

      @_pending.push decorator

    ###
     runs a function just once
    ###

    _runOnce: (key, callback, run) =>

      # 2 = loaded
      if (code = @_running[key]) is 2
        return callback()

      if callback
        @once (event = "__#{key}"), callback

      return if code

      #1 = loading
      @_running[key] = 1

      run () =>

        # done!
        @_running[key] = 2
        @emit event


