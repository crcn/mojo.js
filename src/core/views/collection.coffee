
define ["bindable", "../utils/async", "cstep", "asyngleton", "../utils/throttleCallback"], (bindable, async, cstep, asyngleton, throttleCallback) ->

  # randomly calls setImmediate for callbacks
  callbackThrottle = throttleCallback 20
    

  class extends bindable.Collection

    ###
    ###

    constructor: () ->
      super arguments...

      @enforceId false

      # keep tabs on any late items
      @on "insert", @_loadLateItem

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

      # first time being called? 
      if @get("currentState") isnt method
        @set "currentState", method
        @emit method

      # runs the current decorator
      run = (item, next) ->
        fn = item[method]
        return next() if not fn

        # randomly calls .setImmediate to break the callstack. This prevents
        # a stack overflow in older browsers
        callbackThrottle.call item, fn, next

      # called once all the *current* decorators have been initialized
      done = (err, result) => 
        @_callPending method, event, callback

      # source is copied incase any *new* items are added - new items can be pushed / unshifted, which
      # can screw up the loading process. _callPending is used to capture any decorators that might
      # have been added a bit late.
      src = source.concat()

      if not ~@limit 
        async.forEach src, run, done
      else
        async.eachLimit src, @limit, run, done

    ###
     Calls any pending 
    ###

    _callPending: (method, event, callback) ->

      # no pending items? We're finished here
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

    _loadLateItem: (item) => 

      # hasn't even started yet!
      return unless @has("currentState")

      # already done? display the item
      if @get("displayed")
        item.display?()
        return

      if not @_pending
        @_pending = []

      @_pending.push item

