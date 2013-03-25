define ["../../core/views/base", 
"../../core/views/input/select", 
"../../core/views/input/text", 
"../../core/views/input/form", 
"mannequin",
"bindable",
"../core/templates", 
"../../core/i18n/translate"], (View, SelectInputView, TextInputView, FormView, mannequin, bindable, templates, t) ->
        
    
  schema = new mannequin.Schema({
    grade: { $type: "number", $required: true },
    class_name: { $type: "string", $required: true }
  })

  Classroom = mannequin.dictionary().register("classroom", schema).getClass()


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

    source: bindable.Object.from("modelLocator.grades")


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

    # model: Bindings.to("modelLocator.createClassWizard.").bothWays()


    ###
    ###

    title: t("Add Class")

    ###
    ###

    template: templates.addClass

    ###
    ###

    events: {
        "next": () -> @submit()
    },

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



  


