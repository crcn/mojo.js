define () ->
  
  class ViewDecorator 

    ###
    ###

    constructor: (@view) ->

    ###
     called when the view is added to an element
    ###

    setup: (callback) -> callback()


    ###
     called after re-render
    ###

    resetup: (callback) -> callback()


    ###
     called when a view is removed
    ###

    teardown: (callback) -> callback()

    ###
     disposes immediatly without the teardown
    ###

    dispose: () ->
