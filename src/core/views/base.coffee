define ["./internal", "./decor/factory"], (InternalView, DecorFactory) ->
  
  class BaseView extends InternalView

    init: () ->
      DecorFactory.setup @
      super()




