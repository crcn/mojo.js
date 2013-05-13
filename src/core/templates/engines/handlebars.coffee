define ["./base", "handlebars", "i18next"], (Base, Handlebars, i18n) ->

  class HandlebarsEngine extends Base

    extension: "hb"

    ###
    ###

    init: () ->
      Handlebars.registerHelper "t", (i18key) ->
        new Handlebars.SafeString(i18n.t(i18key))

    ###
    ###

    compile: (source) ->
      template = Handlebars.compile source
      return {
        render: (options, callback) ->
          callback null, template options
      }

