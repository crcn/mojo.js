define ["./internal", "./decor/factory"], (InternalView, DecorFactory) ->
  
  class BaseView extends InternalView

    ###
     expose this so third-party modules can add a decorator
    ###

    @addDecoratorClass: DecorFactory.addDecoratorClass

    ###
    ###
    
    _initDecor: () ->
      super()
      DecorFactory.setup @




