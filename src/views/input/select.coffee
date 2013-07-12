InputView = require "./base"
View      = require "../base"
templates = require "../../templates/factory"
dref      = require "dref"
bindable  = require "bindable"
selectInputTemplate = require "./selectInput.pc"
selectTemplate = require "./select.pc"


class SelectInputOptionView extends View
  paper: selectInputTemplate


class SelectInputView extends InputView

  ###
  ###

  paper: selectTemplate

  ###
  ###

  sections:
    selectList:
      type           : "list"
      modelViewClass : SelectInputOptionView
      source         : "source"
      transform      : (model, list) -> 
      
        view = list.view
        
        _id   : dref.get(model, "_id"),
        value : (dref.get(model, view.get("modelValue")) or dref.get(model, view.get("modelLabel"))),
        label : dref.get(model, view.get("modelLabel")),
        data  : model
        

  ###
  ###

  selectLabel: "Select"

  ###
  ###

  modelLabel: "label"

  ###
  ###

  modelValue: "_id"

  ###
  ###

  _changeSelect: (event) ->

    selected    = @$(":selected")
    selectedVal = selected.val()

    # de-select the model
    if selectedVal is "nil"
      return @deselect()

    # need to offset the default value
    @select selected.index() - @_inc()
      
  ###
   Selects an model based on the index
  ###

  select: (index) =>

    if !~index
      return @deselect()

    model = @get("source").at(index)
    @set "value", model.value or model

  ###
   deselects the model
  ###

  deselect: () ->
    @set "value", undefined

  ###
  ###

  _inc: () -> if @get("selectLabel") then 1 else 0

  ###
  ###

  _onValueChanged: (value) =>

    super value


    index = -1

    for model, i in @get("source").source()
      if model.value is value
        index = i
        break



    if not ~index
      @set "nothingSelected", Math.random()
      return


    $($(this.section.elements).find("option")[index + @_inc()]).attr("selected", "selected")

module.exports = SelectInputView
