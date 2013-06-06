define ["../index", "../../templates/factory"], (BaseView, templates) ->

  class BaseInputView extends BaseView

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

