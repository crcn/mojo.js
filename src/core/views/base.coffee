define ["./internal", "./decor/factory"], (InternalView, DecorFactory) ->
  
  class BaseView extends InternalView

    _initDecor: () ->
      super()
      DecorFactory.setup @




