define ["../../i18n/translate", "./base"], (t, BaseTemplatePlugin) ->
  
  ###
  ###

  class I18NPlugin extends BaseTemplatePlugin


    ###
    ###

    templateHelper: () =>

      {
        name: "i",
        render: (text) -> t text
      }
