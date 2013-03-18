define ["../../core/views/state", "../core/templates", "./addClass", "./addStudents", "./addBehaviors"], (StateView, templates, AddClassView, AddStudentsView, AddBehaviorsView) ->
  
  class AddClassWizardView extends StateView

    ###
    ###

    title: "Add A Class"

    ###
    ###

    template: templates.addClassWizard,

    ###
    ###

    childrenElement: ".modal-body",

    ###
    ###

    constructor: () ->
      super {
        states: [
          new AddClassView()
        ]
      }

    ###
    ###

    init: () ->
      super()
      @glue "currentView.title", "title"
  


