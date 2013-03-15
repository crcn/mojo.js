define ["./base", "handlebars"], (Base, Handlebars) ->

  class HandlebarsEngine extends Base

    constructor: () ->
      super "hb"

    ###
    ###

    compile: (source) ->

      template = Handlebars.compile source

      return {
        render: (options, callback) ->
          callback null, template options
      }


  new HandlebarsEngine()
