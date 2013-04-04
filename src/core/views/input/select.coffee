define ["../list", "./base", "../base", "../../templates/factory", "dref", "bindable"], (ListView, InputView, View, templates, dref, bindable) ->

  class SelectInputView extends InputView

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

    itemValue: "_id"

    ###
    ###

    childViewClass: View

    ###
    ###

    transformSourceItem: (item) =>
      {
        _id: dref.get(item, "_id"),
        value: (dref.get(item, @get("itemValue")) or dref.get(item, @get("itemLabel"))),
        label: dref.get(item, @get("itemLabel")),
        data: item
      }

    ###
    ###

    init: () ->
      super()
      @children = new bindable.Collection([ new View { label: @get("selectLabel") } ])

    ###
    ###

    events: {
      "change select": (event) ->
        selected    = @$(":selected")
        selectedVal = selected.val()

        # de-select the item
        if not selectedVal.length
          return @deselect()

        # need to offset the default value
        @select selected.index() - 1
    }


    ###
     Selects an item based on the index
    ###

    select: (index) =>

      if !~index
        return @deselect()

      @set "value", @get("source").at(index).value

    ###
     deselects the item
    ###

    deselect: () ->
      @set "value", undefined

    ###
    ###

    _onValueChanged: (value) =>
      super()

      index = -1

      for item, i in @source.source()
        if item.value is value
          index = i
          break

      if not ~index
        return

      @$("select").children().eq(index).attr("selected", "selected")


