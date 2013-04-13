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
      model.save (err, result) =>
        if err 
          return @_showErrorMessage err

        @emit "complete"

    ###
    ###

    _onRendered: () ->
      super()

      # initializes the model
      @_validate()

      for inputView in @children.source()
        @bind("model.#{inputView.get("name")}").to(inputView, "value").to(@_validate).bothWays()

    ###
    ###

    _validate: () =>
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

    _model: () =>
      model = @get("model")
      return model if @get("model")
      clazz = @get "modelClass"
      model = new clazz
      @set "model", model
      model



