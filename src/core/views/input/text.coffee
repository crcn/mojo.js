define ["../base", "../../templates/factory"], (BaseView, templates) ->

  class TextInputView extends BaseView

    ###
    ###

    template: templates.fromSource("<input type='text' name='{{view.name}}'></input>", { engine: "handlebars" })


    ###
    ###

    attributesElement: "input"

