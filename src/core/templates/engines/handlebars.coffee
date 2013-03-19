define ["./base", "handlebars"], (Base, Handlebars) ->

  class HandlebarsEngine extends Base

    extension: "hb"

    ###
    ###

    init: () ->
      @factory.plugins.forEach (plugin) =>
        return if not plugin.templateHelper
        helper = plugin.templateHelper()
        Handlebars.registerHelper helper.name, (getText) ->
          return helper.render(getText())

        

    ###
    ###

    compile: (source) ->

      template = Handlebars.compile source

      return {
        render: (options, callback) ->
          callback null, template options
      }

