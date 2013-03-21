define ["../../core/views/base", 
"../../core/views/input/select", 
"../../core/views/input/text", 
"../../core/views/input/form", 
"../../core/models/base", 
"mannequin", 
"../core/templates", 
"../../core/i18n/translate"], (View, SelectInputView, TextInputView, FormView, BaseModel, mannequin, templates, t) ->
        
    
  schema = new mannequin.Schema({
    grade: { $type: "number", $required: true },
    class_name: { $type: "string", $required: true }
  })

  class Classroom extends BaseModel

    ###
    ###

    schema: schema


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

    modelClass: Classroom

    ###
    ###

    submitElement: "#next-class-step"


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


  


