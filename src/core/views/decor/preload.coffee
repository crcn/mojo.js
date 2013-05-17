define ["./base"], (BaseDecor) ->
  
  class PreloadDecorator extends BaseDecor

    ###
    ###

    load: (next) ->
      model = @view.get("item") or @view.get("model")
      return next() if not model or not model?.fetch
      model.fetch next


  PreloadDecorator.getOptions = (view) -> true

  PreloadDecorator