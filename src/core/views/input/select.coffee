define ["../base", "../../templates/factory"], (View, templates) ->

  class SelectInputView extends View

    ###
    ###

    template: templates.fromSource("<select></select>")

    ###
    ###

    init: () ->
      super()
      @source = {}



