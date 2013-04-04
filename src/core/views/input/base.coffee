define ["../base", "../../templates/factory"], (BaseView, templates) ->

  class BaseInputView extends BaseView

    ###
    ###

    events: {
      "input input": "_onInputChange"
    }

    ###
    ###

    _onRendered: () ->
      super()
      @bind "value", @_onValueChange


    changed: () ->
      @emit "data", { name: @get("name"), value: @get("value") }


    ###
     Reflect the value change in the text input
    ###

    _onValueChange: (value) =>
      @changed()

