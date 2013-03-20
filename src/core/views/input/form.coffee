define ["../base", "../../templates/factory"], (BaseView, templates) ->
  
  ###
  ###

  class FormView extends BaseView

    ###
    ###

    template: templates.fromSource("<form></form>")

    ###
    ###

    _onAttached: () =>
      super()

      @element.bind "data", (e, d) =>
        e.stopPropagation()
        @set "data.#{d.name}", d.value
