BaseView  = require "./base"
templates = require "../../templates/factory"
textTemplate = require "./text.pc"


class TextInputView extends BaseView

  ###
  ###

  paper: textTemplate

  ###
  ###

  events: 
    "keyup": "_onInputChange"

  ###
   on input change, set the value of this text input to the element value
  ###

  _onInputChange: () ->
    @set "value", @$().val()

  ###
   Reflect the value change in the text input
  ###

  _onValueChanged: (value) =>
    super value
    @$().val value

module.exports = TextInputView