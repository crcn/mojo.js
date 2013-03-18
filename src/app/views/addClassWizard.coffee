define ["../../core/views/state", "../core/templates", "./addClass", "./addStudents", "./addBehaviors"], (StateView, templates, AddClassView, AddStudentsView, AddBehaviorsView) ->
  
  class AddClassWizardView extends StateView

    ###
    ###

    template: templates.addClassWizard,

    ###
    ###

    childrenElement: ".modal-body",


    ###
    ###

    transition: {
      ".confirmation-dailog": {
        enter: {
          from: { opacity: 0,  scale: 0.5 },
          to: { opacity: 1,  scale: 1 }
        },
        exit: {
          to: { opacity: 0,  scale: 1.5 }
        }
      },
      ".modal-backdrop": {
        enter: {
          from: { opacity: 0 },
          to: { opacity: 0.75 }
        },
        exit: {
          to: { opacity: 0  }
        }
      }
    },

    ###
    ###

    events: {
      "mouseOver .close .cancel-btn": "remove",
      "click .confirm-positive": "nextState"
    },

    ###
    ###

    constructor: () ->
      super {
        states: [
          new AddClassView(),
          new AddStudentsView(),
          new AddBehaviorsView()
        ]
      }

    ###
    ###

    init: () ->
      super()
      @glue "currentView.title", "title"

    ###
    ###

    _endOfStates: () -> @remove()
  


