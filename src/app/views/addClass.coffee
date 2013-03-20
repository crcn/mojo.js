define ["../../core/views/base", 
"../../core/views/input/select", 
"../../core/views/input/text", 
"../core/templates", 
"../core/modelLocator", 
"../../core/i18n/translate"], (View, SelectInputView, TextInputView, templates, modelLocator, t) ->
        

    
  class SelectClassesView extends SelectInputView

    ###
    ###

    selectLabel: "Select year"



    ###
    ###

    itemLabel: "name"


    ###
    ###

    modelLocator: modelLocator

    ###
    ###

    name: "grade"

    ###
    ###

    source: "modelLocator.grades"


  class NameClassInputView extends TextInputView

    ###
    ###

    name: "class_name"

    ###
    ###

    attributes: {
        placeholder: "Name your class"
    }



  class AddClassView extends View

    ###
    ###

    classyears: [{
      value: 2005
    }]


    ###
    ###

    title: t("Add Class")

    ###
    ###


    template: templates.addClass


    ###
    ###

    children: {
      "#select-class-year-container": SelectClassesView,
      "#add-name-container": NameClassInputView
    },


    ###
    ###

    init: () ->
      super()


  


