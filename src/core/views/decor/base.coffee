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
    ###

    render: (callback) -> callback()

    ###
    ###

    display: (callback) -> callback()

    ###
    ###

    remove: (callback) -> callback()

    ###
     disposes immediatly without the teardown
    ###

    dispose: () ->
