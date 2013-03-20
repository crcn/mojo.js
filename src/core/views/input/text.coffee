define ["../base", "../../templates/factory"], (BaseView, templates) ->

  class TextInputView extends BaseView

    ###
    ###

    template: templates.fromSource("<input type='text' name='{{view.name}}'></input>", { engine: "handlebars" })


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

    "_onInputChange": () ->
      @set "value", @element.find("input").val()

    ###
    ###

    "_onLoaded": () ->
      super()
      @bind "value", @_onValueChange

    ###
     Reflect the value change in the text input
    ###

    "_onValueChange": (value) =>
      @element.find("input").val value

