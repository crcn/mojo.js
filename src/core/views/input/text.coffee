define ["../base", "../../templates/factory"], (BaseView, templates) ->

  class TextInputView extends BaseView

    ###
    ###

    template: templates.fromSource("<input type='text' name='{{view.name}}'>", { engine: "handlebars" })


    ###
    ###

    attributesElement: "input"

    ###
    ###

    events: {
      "input input": "_onInputChange"
    }

    ###
     on input change, set the value of this text input to the element value
    ###

    _onInputChange: () ->
      @set "value", @$("input").val()
      @el.trigger "data", { name: @get("name"), value: @get("value") }

    ###
    ###

    _onRendered: () ->
      super()
      @bind "value", @_onValueChange


    ###
     Reflect the value change in the text input
    ###

    _onValueChange: (value) =>
      @$("input").val value

