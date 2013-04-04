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

      for inputView in @children.source() then do (inputView) =>
        console.log "model.#{inputView.get("name")}"
        @bind("model.#{inputView.get("name")}").to(inputView, "value").to (value) ->
          console.log inputView.get("name"), value



    ###
    ###

    _onDisplay: () =>
      super()

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

    _validate: () ->
      @_model().validate (err) =>
        console.log err
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

    _model: () =>
      model = @get("model")
      return model if @get("model")

      console.log new Error().stack

      console.log "CREATE"

      clazz = @get "modelClass"
      model = new clazz
      @set "model", model
      model



