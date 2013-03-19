define ["../base", "../../templates/factory"], (View, templates) ->

  class SelectInputView extends View


    name: "craig"

    ###
    ###

    template: templates.fromSource("<div data-text='data.name'></div>")

    ###
    ###

    init: () ->
      super()



