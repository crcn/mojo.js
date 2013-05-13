
define ["bindable", "../utils/async", "cstep", "asyngleton"], (bindable, async, cstep, asyngleton) ->
    

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
      @_callViewMethod "load", "loaded", false, callback

    ###
     renders the view 
    ###

    render: asyngleton (callback) ->
      @load () => @_callViewMethod "render", "rendered", false, callback

    ###
     called when we want to display the view
    ###

    display: asyngleton (callback) -> 
      @render () => 
        @on "insert", @_displayLateItem
        @_callViewMethod "display", "displayed", false, callback

    ###
     removes & unloads the view
    ###

    remove: asyngleton (callback) ->
      @display () => @_callViewMethod "remove", "removed", false, callback


    ###
    ###

    #emit: (name) ->
    #  super arguments...
    #  @view?.emit arguments...


    ###
    ###

    _callViewMethod: (method, event, reverse, callback = (() ->)) ->

      @emit method

      stack = if reverse then @source().reverse() else @source()

      run = (item, next) ->
        fn = item[method]
        return next() if not fn
        fn.call item, next

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

