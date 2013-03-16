define ["../../core/views/state", "../core/templates", "./addClass", "./addStudents", "./addBehaviors"], (StateView, templates, AddClassView, AddStudentsView, AddBehaviorsView) ->
  
  class AddClassWizardView extends StateView

    ###
    ###

    constructor: () ->
      super {
        template: templates.addClassModal,
        states: [
          new AddClassView(),
          new AddStudentsView(),
          new AddBehaviorsView()
        ]
      }
  


