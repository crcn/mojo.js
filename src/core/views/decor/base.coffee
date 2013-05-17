define () ->
  
  class ViewDecorator 

    ###
    ###

    constructor: (@view, @options) -> @init()

    ###
    ###

    init: () ->

    ###
     disposes immediatly without the teardown
    ###

    dispose: () ->