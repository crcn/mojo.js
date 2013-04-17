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
      @bind "value", @_onValueChanged

    ###
    ###

    changed: () ->
      @emit "data", { name: @get("name"), value: @get("value") }

    ###
     Reflect the value change in the text input
    ###

    _onValueChanged: (value) =>
      @changed()

