define ["../list", "../base", "../../templates/factory", "dref"], (ListView, View, templates, dref) ->

  class SelectInputView extends ListView

    ###
    ###

    template: templates.fromSource("<select name='{{view.name}}'></select>", { engine: "handlebars" })

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

      # add the initial child so the default option is visible
      @children.addItemAt(new View { label: @get("selectLabel") }, 0)


    ###
    ###

    events: {
      "change select": (event) ->
        selectedVal = @element.find(":selected").val()

        # de-select the item
        if not selectedVal.length
          return @deselect()

        @select Number selectedVal
    }

    ###
     Selects an item based on the index
    ###

    select: (index) ->
      if index is undefined
        return @deselect()

      @set "selectedItem", @source.getItemAt index

      @element.trigger "data", { name: @get("name"), value: @get("selectedItem").data }

    ###
     deselects the item
    ###

    deselect: () ->
      @set "selectedItem", null


    ###
    ###

    _onAttached: () =>
      super()

    ###
    ###

    _onLoaded: () =>
      super()

      # listen for any changes in the selected item so it can be reflected in the drop menu
      @bind "selectedItem", @_onSelectedItemChange

    ###
     transforms the source to something the drop menu can use
    ###

    _transformSelectItem: (item, index) =>
      {
        value: index,
        label: dref.get(item, @get("itemLabel")),
        data: item
      }


    ###
    ###

    _createSource: () ->
      source = super()
      source.transform @_transformSelectItem
      source


    ###
    ###

    _onSelectedItemChange: (item) =>

      index = 0
      if not item
        index = 0
      else
        index = item.value

      @element.find("select").children().eq(index).attr("selected", "selected")


