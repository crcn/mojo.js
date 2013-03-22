define ["../base", "../../templates/factory", "mannequin"], (BaseView, templates, mannequin) ->
  
  ###
  ###

  class FormView extends BaseView

    ###
    ###

    modelClass: mannequin.Model

    ###
    ###

    template: templates.fromSource("<form></form>")


    ###
    ###

    submit: (callback = (()->)) =>


      event.stopImmediatePropagation()

      model = @_model()
      model.set @get "data"


      model.validate (err, result) =>
        if err 
          callback err
          return @_showErrorMessage err

        @emit "complete"

    ###
    ###

    _onAttached: () =>
      super()

      submitElement = @get("submitElement")

      if submitElement
        @$(submitElement).bind "click", @_onSubmit

      # listen for any data emitted by child form inputs
      @element.bind "data", (e, d) =>

        # stop the propagation so parent form fields don't catch this
        e.stopPropagation()

        # set to THIS data - this will be added to the model later on
        @set "data.#{d.name}", d.value

    ###
    ###

    _onSubmit: (event) =>
      @submit()



    ###
    ###

    _showErrorMessage: () =>

    ###
    ###

    _onLoaded: () =>
      super()


    ###
    ###

    _model: () ->
      model = @get("model")
      if model
        return model

      clazz = @get "modelClass"
      model = new clazz
      @set "model", model
      model



