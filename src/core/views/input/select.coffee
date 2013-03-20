define ["../list", "../base", "../../templates/factory", "dref"], (ListView, View, templates, dref) ->

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

    selectLabel: "Select"

    ###
    ###

    itemLabel: "label"

    ###
    ###

    childViewClass: View

    ###
    ###

    init: () ->
      super()
      @children.addItemAt(new View { label: @get("selectLabel") }, 0)



    ###
    ###

    _onAttached: () =>
      super()


    ###
    ###

    _transformSelectItem: (item, index) =>
      console.log item
      {
        value: index,
        label: dref.get item, @get("itemLabel")
      }


    ###
    ###

    _createSource: () ->
      source = super()
      source.transform @_transformSelectItem
      source


