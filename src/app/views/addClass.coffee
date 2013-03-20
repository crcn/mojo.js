define ["../../core/views/base", 
"../../core/views/input/select", 
"../../core/views/input/text", 
"../../core/views/input/form", 
"../core/templates", 
"../../core/i18n/translate"], (View, SelectInputView, TextInputView, FormView, templates, t) ->
        

    
  class SelectClassesView extends SelectInputView

    ###
    ###

    selectLabel: "Select year"

    ###
    ###

    itemLabel: "name"

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



  class AddClassView extends FormView

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

    ###
    ###

    _onAttached: () =>
      super()

      @on "change:data.**", (data) =>
        console.log @get "data"


  


