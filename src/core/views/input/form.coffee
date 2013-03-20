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

      data = {}

      @element.bind "data", (e, d) ->
        e.stopPropagation()
        data[d.name] = d.value
        console.log data
