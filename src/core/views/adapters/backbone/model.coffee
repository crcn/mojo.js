define ["bindable"], (bindable) ->

  ###
   TODO - implement virtual methods
  ###

  class BackboneWrapperModel extends bindable.Object

    ###
    ###
    
    constructor: (model) ->
      super model.attributes
      @model = model
      model.model = @

      for key of model then do (key) =>
        v = model[key]
        if typeof v is "function" and not @[key]
          @[key] = () -> v.apply model, arguments

    ###
    ###

    get: () -> 
      @model.get arguments...

    ###
    ###

    _set: () -> 
      @model.set arguments...
      super arguments...

