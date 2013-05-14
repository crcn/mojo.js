
define ["bindable", "../utils/async", "cstep", "asyngleton", "../utils/throttleCallback"], (bindable, async, cstep, asyngleton, throttleCallback) ->

  
  callbackThrottle = throttleCallback 20
    

  class extends bindable.Collection

    ###
    ###

    constructor: () ->
      super arguments...

    ###
    ###
    
    limit: 1

    ###
     loads the template, and anything else that might be needed
    ###

    load: asyngleton (callback) -> 
      @_callViewMethod "load", "loaded", callback

    ###
     renders the view 
    ###

    render: asyngleton (callback) ->
      @load () => @_callViewMethod "render", "rendered", callback

    ###
     called when we want to display the view
    ###

    display: asyngleton (callback) -> 
      @render () => 
        @on "insert", @_displayLateItem
        @_callViewMethod "display", "displayed", callback

    ###
     removes & unloads the view
    ###

    remove: asyngleton (callback) ->
      @display () => @_callViewMethod "remove", "removed", callback

    ###
    ###

    _callViewMethod: (method, event, callback = (() ->)) ->

      @emit method

      run = (item, next) ->
        fn = item[method]
        return next() if not fn
        fn.call item, next
        # callbackThrottle.call item, fn, next

      done = (err, result) =>
        @emit event
        return callback(err) if err
        callback()

      if not ~@limit 
        async.forEach @source(), run, done
      else
        async.eachLimit @source(), @limit, run, done


    ###
    ###

    _displayLateItem: (item) => 
      item.display()

