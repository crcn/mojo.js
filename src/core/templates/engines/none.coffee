define ["./base"], (Base) ->

  class VanillaEngine extends Base

    constructor: () ->
      super "tpl"

    ###
    ###

    compile: (source) ->

      return {
        render: (options, callback) ->
          callback null, source
      }


  new VanillaEngine()
