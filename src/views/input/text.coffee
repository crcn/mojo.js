BaseView  = require "./base"
templates = require "../../templates/factory"
textTemplate = require "./text.pc"


class TextInputView extends BaseView

  ###
  ###

  paper: textTemplate

module.exports = TextInputView