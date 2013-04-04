define ["./base", "../../templates/factory"], (BaseView, templates) ->

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


    ###
     Reflect the value change in the text input
    ###

    _onValueChanged: (value) =>
      super value
      @$("input").val value

