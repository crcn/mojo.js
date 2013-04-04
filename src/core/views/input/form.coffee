define ["../base", "../../templates/factory", "mannequin"], (BaseView, templates, mannequin) ->
  
  ###
  ###

  class FormView extends BaseView

    ###
    ###

    modelClass: null

    ###
    ###

    template: templates.fromSource("<form></form>")


    ###
    ###

    submit: (callback = (()->)) =>

      model = @_model()
      model.set @get "data"

      model.save (err, result) =>
        if err 
          callback err
          return @_showErrorMessage err

        @emit "complete"

    ###
    ###

    _onRendered: () ->
      super()
      model = @_model()
      for inputView in @children.source()
        model.bind(inputView.get("name")).to(inputView, "value")


    ###
    ###

    _onDisplay: () =>
      super()

      submitElement = @get("submitElement")

      if submitElement
        @$(submitElement).bind "click", @_onSubmit

      @set "data", {}

      # listen for any data emitted by child form inputs
      @el.bind "data", (e, d) =>

        # stop the propagation so parent form fields don't catch this
        e.stopPropagation()

        # set to THIS data - this will be added to the model later on
        @set "data.#{d.name}", d.value

        @_validate()

      # validate the data that might be set initially
      @_validate()


    ###
    ###

    _onSubmit: (event) =>
      @submit()

    ###
    ###

    _validate: () ->
      console.log @get "data"
      @_model().set @get "data"
      @_model().validate (err) =>
        @_toggleValidity !err

    ###
     useful for enabling / disabling a button
    ###

    _toggleValidity: (valid) ->
      @set "valid", valid


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



