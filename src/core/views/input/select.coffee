define ["../list", "../base", "../../templates/factory"], (ListView, View, templates) ->

  class SelectInputView extends ListView

    ###
    ###

    template: templates.fromSource("<select></select>")

    ###
    ###

    childrenElement: "select"

    ###
    ###

    childTemplate: templates.fromSource("<option value='{{value}}'>{{label}}</option>", { engine: "handlebars" })

    ###
    ###

    childViewClass: View

    ###
    ###

    init: () ->
      super()


    ###
    ###

    _onAttached: () =>
      super()



