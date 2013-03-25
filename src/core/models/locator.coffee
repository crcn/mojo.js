define ["bindable", "outcome"], (bindable, outcome) ->

  outcome.logAllErrors true
  
  ###
   core model locator should be vanilla so that the application has the ability to override
   these values
  ###

  class ModelLocator extends bindable.Object


  new ModelLocator()
