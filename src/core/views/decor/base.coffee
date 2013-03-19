define () ->
  
  class ViewDecorator 

    ###
    ###

    constructor: (@view) -> @init()

    ###
    ###

    init: () ->

    ###
    ###

    load: (callback) -> callback()

    ###
     called when the view is added to an element
    ###

    attach: (callback) -> callback()

    ###
     called when a view is removed
    ###

    remove: (callback) -> callback()

    ###
     disposes immediatly without the teardown
    ###

    dispose: () ->
