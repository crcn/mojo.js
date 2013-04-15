define ["../list", "./base", "../base", "../../templates/factory", "dref", "bindable"], (ListView, InputView, View, templates, dref, bindable) ->
    
  class SelectInputOptionView extends View

  class SelectInputView extends InputView

    ###
    ###

    template: templates.fromSource("<select name='{{view.name}}'></select>", { engine: "handlebars" })

    ###
    ###

    list:
      "selectList select":
        itemViewClass: SelectInputOptionView
        itemViews: () -> [new SelectInputOptionView { label: @get("selectLabel") }]
        source: "source"
        itemTemplate: templates.fromSource("<option value='{{value}}'>{{label}}</option>", { engine: "handlebars" })
        transform: (item, list) ->
          view = list.view
          {
            _id: dref.get(item, "_id"),
            value: (dref.get(item, view.get("itemValue")) or dref.get(item, view.get("itemLabel"))),
            label: dref.get(item, view.get("itemLabel")),
            data: item
          }

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

    events: 
      "change select": (event) ->
        selected    = @$(":selected")
        selectedVal = selected.val()

        # de-select the item
        if not selectedVal.length
          return @deselect()

        # need to offset the default value
        @select selected.index() - 1
    


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
      super value

      index = -1

      for item, i in @get("source").source()
        if item.value is value
          # offset the default item
          index = i + 1
          break

      if not ~index
        index = 0

      @$("select").children().eq(index).attr("selected", "selected")


