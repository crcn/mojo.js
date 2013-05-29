
define ["bindable", "../utils/async", "cstep", "asyngleton", "../utils/throttleCallback", "flatstack"], (bindable, async, cstep, asyngleton, throttleCallback, flatstack) ->
    
  class extends bindable.Collection

    ###
    ###

    constructor: () ->
      super arguments...

      @enforceId false

      @_callstack = flatstack @


      # keep tabs on any late decorators
      @on "insert", @_loadLateDecor

    ###
    ###
    
    limit: 1

    ###
     Creates, and parses the DOM
    ###

    load: asyngleton (callback) -> 
      @_call "load", "loaded", @source(), callback

    ###
     attaches any controllers / bindings to the view (rivets)
    ###

    render: asyngleton (callback) ->
      @load () => 
        @_call "render", "rendered", @source(), callback

    ###
     adds the elements to the DOM - transitions happen here
    ###

    display: asyngleton (callback) -> 
      @render () => 
        @_call "display", "displayed", @source(), callback

    ###
     removes & unloads the view
    ###

    remove: asyngleton (callback) ->
      @display () => 
        @_call "remove", "removed", @source(), callback

    ###
    ###

    emit: () ->
      super arguments...
      @view?.emit arguments...

    ###
    ###

    _call: (method, event, source, callback = (() ->)) ->

      # callstack = flatstack @

      # first time being called? 
      if @get("currentState") isnt method
        @set "currentState", method
        @emit method

      # called once all the *current* decorators have been initialized
      done = () => 
        @_callPending method, event, callback

      # source is copied incase any *new* items are added - new items can be pushed / unshifted, which
      # can screw up the loading process. _callPending is used to capture any decorators that might
      # have been added a bit late.
      src = source.concat()

      
      src = src.map (decor) => 
        { context: decor, fn: decor[method] or @_noFn }
      

      @_callstack.push.apply @_callstack, src
      @_callstack.push done
      

      #async.eachSeries src, run, done

    _noFn: () ->

    ###
     Calls any pending 
    ###

    _callPending: (method, event, callback) ->


      # no pending decorators? We're finished here
      unless @_pending
        @set event, true
        @emit event
        callback()
        return

      pending   = @_pending
      @_pending = undefined


      @_call method, event, pending, callback

    ###
    ###

    _loadLateDecor: (decorator) => 

      # hasn't even started yet!
      return unless @has("currentState")

      # already done? display the decorator
      if @get("displayed")
        decorator.display?()
        return

      if not @_pending
        @_pending = []

      @_pending.push decorator

