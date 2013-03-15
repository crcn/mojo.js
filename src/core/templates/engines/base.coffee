define () ->
  
  class BaseEngine

    constructor: (@extension) ->


    ###
     renders a template - must always be asynchronous
    ###

    compile: (source) -> throw new Error("must be overridden")