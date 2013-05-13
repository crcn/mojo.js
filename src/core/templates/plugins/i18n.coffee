define ["i18next", "./base"], (i18n, BaseTemplatePlugin) ->
  
  ###
  ###

  class I18NPlugin extends BaseTemplatePlugin


    ###
    ###

    templateHelper: () =>

      {
        name: "i",
        render: (text) -> i18n.t text
      }
