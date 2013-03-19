define ["../../core/views/base", "../../core/views/container", "../../core/views/input/select", "../core/templates"], (View, ContainerView, SelectInputView, templates) ->
  
  class AddClassView extends View

    ###
    ###

    classyears: [{
      value: 2005
    }]


    ###
    ###

    title: "Add Class"

    ###
    ###


    template: templates.addClass


    ###
    ###

    children: {
      "#select-class-year-container": SelectInputView
    },


    ###
    ###

    init: () ->
      super()


  


